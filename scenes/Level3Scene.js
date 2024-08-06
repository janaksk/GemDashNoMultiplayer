import { createPlayer, handlePlayerMovement, playSoundEffect } from '../utils/commonFunctions.js';

class Level3Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3Scene' });
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
        this.load.image('sky', 'assets/backgrounds/tree.png');
        this.load.atlas('tiles', 'assets/platformer.png', 'assets/platformer.json');

        // Environment Assets
        this.load.image('ground', 'assets/level1to5/platform.png');
        this.load.image('wall', 'assets/level1to5/verticalplat.png');

        // Entity Assets
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });

        // SFX Assets
        this.load.audio('starCollected', 'assets/sfx/star_collected.mp3');
        this.load.audio('jumpSound', 'assets/sfx/jump.mp3');
        this.load.audio('waterSplash', 'assets/sfx/water_splash.mp3');

    }

    create() {


        this.add.image(400, 300, 'sky');
        this.platforms = this.physics.add.staticGroup();

        // Water
        const water = this.physics.add.staticGroup();

        // What Tiles Water
        for (let i = 0; i < 6; i++)
        {
            water.create(i * 128, 552, 'tiles', '17');
        }

        // ground
        const ground = this.physics.add.staticGroup();
        ground.create(64, 536, 'tiles', '6');
        ground.create(64, 536-128, 'tiles', '6');
        ground.create(64, 536-256, 'tiles', '6');
        ground.create(64, 536-384, 'tiles', '3');
        ground.create(736, 536, 'tiles', '1');

        // this.add.image(740, 440, 'tiles', 'sign2');

        // Platforms
        const platform1 = this.platforms.create(330, 400 ,'tiles', 'platform1');
        const platform2 = this.platforms.create(630, 280,'tiles', 'platform1');

        this.player = createPlayer(this, 64, 64);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.stars = this.physics.add.staticGroup();

        const starPositions = [
            { x: 200, y: 250 }, { x: 200, y: 320 }, { x: 350, y: 120 },
            { x: 400, y: 200 }, { x: 500, y: 110 }, { x: 500, y: 450 },
            { x: 650, y: 400 }, { x: 650, y: 480 }, { x: 750, y: 450 },
            { x: 550, y: 380 }
        ];

        starPositions.forEach(pos => {
            this.stars.create(pos.x, pos.y, 'star').setOrigin(0.5, 0.5).setScale(1).refreshBody();
        });

        this.scoreText = this.add.text(16, 16, 'Score: 0/10', { fontSize: '32px', fill: '#000' });
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, ground);

        this.physics.add.collider(this.player, water, () => {
            this.player.setPosition(64, 64)
            playSoundEffect(this, 'waterSplash', { volume: this.volSFX });
        });
        
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    }

    update() {
        handlePlayerMovement(this.cursors, this.player);

        // Example: Directly play jump sound
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            playSoundEffect(this, 'jumpSound', { volume: this.volSFX });
        }
    }

    collectStar(player, star) {
        // Play the star collection SFX using the external function
        playSoundEffect(this, 'starCollected', { volume: this.volSFX });

        star.disableBody(true, true);
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score} /10`);

        if (this.score === 10) {
            // Fade Out Camera (Shorter duration so you dont die to water)
            this.cameras.main.fadeOut(100);

            // Start next level after camera has faded
            this.time.delayedCall(100, function() {
                this.scene.start('Level4Scene');
            }, [], this);
        }
    }
}

export default Level3Scene;
