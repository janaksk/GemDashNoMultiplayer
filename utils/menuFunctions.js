    export default class MenuOption {
        constructor(scene, x, y, text, callback) {
        this.scene = scene;
        this.option = scene.add.text(x, y, text, { fontSize: "24px", fill: "#fff" })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', callback)
            .on('pointerover', () => this.option.setStyle({ fill: "#ff0" }))
            .on('pointerout', () => this.option.setStyle({ fill: "#fff" }));
        }
    
        setSelected(selected) {
        this.option.setStyle({ fill: selected ? "#ff0" : "#fff" });
        }
    }


  export function addKeyboardInput(scene, menuOptions, updateMenuSelection, callback) {
    scene.input.keyboard.on('keydown-UP', () => navigateUp(scene, menuOptions, updateMenuSelection), scene);
    scene.input.keyboard.on('keydown-DOWN', () => navigateDown(scene, menuOptions, updateMenuSelection), scene);
    scene.input.keyboard.on('keydown-ENTER', callback, scene);
  }
  
  function navigateUp(scene, menuOptions, updateMenuSelection) {
    scene.selectedOptionIndex = Phaser.Math.Wrap(scene.selectedOptionIndex - 1, 0, menuOptions.length);
    updateMenuSelection();
  }
  
  function navigateDown(scene, menuOptions, updateMenuSelection) {
    scene.selectedOptionIndex = Phaser.Math.Wrap(scene.selectedOptionIndex + 1, 0, menuOptions.length);
    updateMenuSelection();
  }

