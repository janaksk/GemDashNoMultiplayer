class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });

  }

  preload() {
    this.load.image("menuBg","assets/backgrounds/mainmenu.png");
    this.load.audio('track2', 'assets/music/Track2.mp3')
  }

  create() {

    //stop all previious music
    this.sound.stopAll();

    const backgroundMusic = this.sound.add('track2', { volume: this.volMusic, loop: true });
    backgroundMusic.play();

    this.add.image(400, 300, "menuBg");

    const x = 420; // X coordinate for button position
    const y = 300; // Y coordinate for button position
    
    const button = this.add.text(x, y, 'Start', {
        fontSize: '32px',
        fontFamily: 'Verdana',
        fill: '#fff',
        backgroundColor: '#6f42c1', // Purple background color
        padding: { x: 20, y: 10 },
        borderRadius: 12, // Rounded edges
        align: 'center',
        stroke: '#5a2a91', // Darker purple border
        strokeThickness: 2
    })
    .setOrigin(0.5, 0.5)
    .setInteractive()
    .setDepth(1);
    
    // Add visual effects for button interaction
    button.on('pointerover', () => button.setStyle({ fill: '#fff', backgroundColor: '#5a2a91', stroke: '#3d0a5b' }));
    button.on('pointerout', () => button.setStyle({ fill: '#fff', backgroundColor: '#6f42c1', stroke: '#5a2a91' }));
    button.on('pointerdown', () => this.scene.start('Level1Scene'));

    }
}


export default MenuScene;
