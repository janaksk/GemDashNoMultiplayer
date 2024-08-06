import { createPlayer, handlePlayerMovement, playSoundEffect } from '../utils/commonFunctions.js';

class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2Scene' });
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

        // SFX Assets
        this.load.audio('starCollected', 'assets/sfx/star_collected.mp3');
        this.load.audio('jumpSound', 'assets/sfx/jump.mp3');
    }

    create() {
        // Putting Foreground and midground
        this.add.image(400, 300, 'sky');
        this.add.image(400, 300, 'midground');
        this.platforms = this.physics.add.staticGroup();
        
        // Floor
        this.platforms.create(200, 553, 'ground');
        this.platforms.create(600, 553, 'ground');
        this.platforms.create(200, 585, 'ground');
        this.platforms.create(600, 585, 'ground');

        // Platforms
        this.platforms.create(530, 440, 'ground');
        this.platforms.create(790, 170, 'ground');

        // Walls
        this.platforms.create(520, 120, 'wall');
        this.platforms.create(237, 465, 'wall');
        this.platforms.create(130, 575, 'wall');
        this.platforms.create(18, 430, 'wall');

        this.player = createPlayer(this, 700, 100);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.stars = this.physics.add.staticGroup();

        const starPositions = [
            { x: 100, y: 100 }, { x: 200, y: 150 }, { x: 300, y: 200 },
            { x: 400, y: 300 }, { x: 400, y: 350 }, { x: 500, y: 500 },
            { x: 650, y: 500 }, { x: 650, y: 300 }, { x: 650, y: 100 },
            { x: 700, y: 150 }
        ];

        starPositions.forEach(pos => {
            this.stars.create(pos.x, pos.y, 'star').setOrigin(0.5, 0.5).setScale(1).refreshBody();
        });

        this.scoreText = this.add.text(16, 16, 'Score: 0/10', { fontSize: '32px', fill: '#000' });
        this.physics.add.collider(this.player, this.platforms);
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
            // Fade Out Camera
            this.cameras.main.fadeOut(800);

            // Start next level after camera has faded
            this.time.delayedCall(800, function() {
                this.scene.start('Level3Scene');
            }, [], this);
        }
    }
}

export default Level2Scene;
