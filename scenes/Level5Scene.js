import { createPlayer, handlePlayerMovement, playSoundEffect } from '../utils/commonFunctions.js';

class Level5Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level5Scene' });
    }

    scoreText;
    score = 0;
    cursors;
    platforms;
    stars;
    player;

    // Sound settings will replace these values
    volMusic = 1;
    volSFX = .5;

    init () {
        // Camera Fade in
        this.cameras.main.fadeIn(800);
    }

    preload() {
        // Background Assets
        this.load.image('sky', 'assets/backgrounds/sky.png');
        this.load.image('midground', 'assets/backgrounds/midground.png');

        // Environment Assets
        this.load.image('ground', 'assets/level1to5/platform.png');
        this.load.image('wall', 'assets/level1to5/verticalplat.png');

        // Entity Assets
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('rocket', 'assets/rocket.png');

        // SFX Assets
        this.load.audio('starCollected', 'assets/sfx/star_collected.mp3');
        this.load.audio('jumpSound', 'assets/sfx/jump.mp3');

        // Water Assets
        this.load.atlas('tiles', 'assets/platformer.png', 'assets/platformer.json');
        this.load.audio('waterSplash', 'assets/sfx/water_splash.mp3');
    }

    create() {
        // Putting Foreground and midground
        this.add.image(400, 300, 'sky');
        this.add.image(400, 300, 'midground');
        this.platforms = this.physics.add.staticGroup();

        // Water
        const water = this.physics.add.staticGroup();

        // What Tiles Water
        for (let i = 3; i < 6; i++)
        {
            water.create(i * 128, 600, 'tiles', '17');
        }
        
        // Floor
        this.platforms.create(150, 553, 'ground');
        this.platforms.create(750, 553, 'ground');
        this.platforms.create(150, 585, 'ground');
        this.platforms.create(750, 585, 'ground');

        // Walls
        this.platforms.create(610, 590, 'wall');
        this.platforms.create(450, 740, 'wall');

        // Platforms
        this.platforms.create(0, 375, 'ground');
        this.platforms.create(500, 375, 'ground');
        this.platforms.create(300, 200, 'ground');
        this.platforms.create(750, 110, 'ground');

        this.player = createPlayer(this, 100, 450);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.stars = this.physics.add.staticGroup();

        const starPositions = [
            { x: 100, y: 250 }, { x: 200, y: 100 }, { x: 570, y: 500 },
            { x: 400, y: 250 }, { x: 450, y: 500 }, { x: 600, y: 250 },
            { x: 400, y: 100 }, { x: 750, y: 150 }, { x: 590, y: 30 },
            { x: 675, y: 420 }
        ];

        starPositions.forEach(pos => {
            this.stars.create(pos.x, pos.y, 'star').setOrigin(0.5, 0.5).setScale(1).refreshBody();
        });

        this.scoreText = this.add.text(16, 16, 'Score: 0/10', { fontSize: '32px', fill: '#000' });
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // Rocket variables
        this.rocketSpeed = 200;
        this.rocketSteps = [0, 0, 0, 0, 0];

        // Create rocket group physics
        this.rockets = this.physics.add.group({ immovable: true, allowGravity: false });

        // Create rockets
        const rocketPositions = [
        { x: 490, y: 165 },
        { x: 770, y: 75 },
        { x: 305, y: 340 },
        { x: 190, y: 340 },
        { x: 780, y: 520 }
        ];

        rocketPositions.forEach((pos, index) => {
        const rocket = this.rockets.create(pos.x, pos.y, 'rocket').setScale(0.5);
        rocket.setVelocityX(index % 2 === 0 ? -this.rocketSpeed : this.rocketSpeed);
        if (index % 2 === 1) {
            rocket.flipX = true;
        }
        });

        this.physics.add.collider(this.rockets, this.platforms);
        this.physics.add.overlap(this.player, this.rockets, this.hitRocket, null, this);
        this.physics.add.overlap(this.player, this.pit, this.pitFall, null, this);

        // Add warning text
        this.warningText = this.add.text(400, 300, 'Rocket speed changing soon!', {
        fontSize: '32px',
        fill: '#ff0000',
        align: 'center'
        }).setOrigin(0.5, 0.5).setVisible(false);

        // Show warning text 2 seconds before speed change
        this.time.addEvent({
        delay: 10000,  // Speed change every 10 seconds
        callback: this.showWarningText,
        callbackScope: this,
        loop: true,
        startAt: 2000  // Start 8 seconds after the previous change to show warning for 2 seconds
        });

        // Change rocket speeds every 10 seconds and hide warning text
        this.time.addEvent({
        delay: 10000,
        callback: this.changeRocketSpeeds,
        callbackScope: this,
        loop: true
        });

        this.physics.add.collider(this.player, water, () => {
            this.player.setPosition(100, 450)
            playSoundEffect(this, 'waterSplash', { volume: this.volSFX });
        });
    }

    update() {
        //super.update();

        handlePlayerMovement(this.cursors, this.player);
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            playSoundEffect(this, 'jumpSound', { volume: this.volSFX });
        } 


        const rocketDirections = [
        [-1, 1, false, true],
        [-1, 1, false, true],
        [1, -1, true, false],
        [-1, 1, false, true],
        [-1, 1, false, true]
        ];

        this.rockets.getChildren().forEach((rocket, index) => {
        this.rocketSteps[index]++;
        if (this.rocketSteps[index] < 320) {
            rocket.setVelocityX(this.rocketSpeed * rocketDirections[index][0]);
        } else if (this.rocketSteps[index] >= 320 && this.rocketSteps[index] < 640) {
            rocket.setVelocityX(this.rocketSpeed * rocketDirections[index][1]);
            rocket.flipX = rocketDirections[index][3];
        } else if (this.rocketSteps[index] == 640) {
            this.rocketSteps[index] = 0;
            rocket.flipX = rocketDirections[index][2];
            rocket.setVelocityX(this.rocketSpeed * rocketDirections[index][0]);
        }
        });

    }

    showWarningText() {
        this.warningText.setVisible(true);
    }

    changeRocketSpeeds() {
        this.rocketSpeed = Phaser.Math.Between(50, 300);
        this.rockets.getChildren().forEach(rocket => {
        rocket.setVelocityX(rocket.body.velocity.x > 0 ? this.rocketSpeed : -this.rocketSpeed);
        });

        // Hide warning text after speed change
        this.warningText.setVisible(false);
    }

    hitRocket(player, rocket) {
        this.player.setPosition(100, 450);
    }

    pitFall(pit, player) {
        this.player.setPosition(100, 450);
    }

    /*
    update() {
        handlePlayerMovement(this.cursors, this.player);
    }
    */
        
    collectStar(player, star) {
        // Play the star collection SFX using the external function
        playSoundEffect(this, 'starCollected', { volume: this.volSFX });

        star.disableBody(true, true);
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score} /10`);

        if (this.score === 10) {
            this.scene.start('MenuScene');
        }
    }
}

export default Level5Scene;
