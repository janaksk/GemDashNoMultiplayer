export function createPlayer(scene, x, y) {
    const player = scene.physics.add.sprite(x, y, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    scene.anims.create({
        key: 'left',
        frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    scene.anims.create({
        key: 'right',
        frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    return player;
}

export function handlePlayerMovement(cursors, player) {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

let currentMusic = null;

export function playBackgroundMusic(scene, key, options = {}) {

    // Stop the currently playing music if there is one
    if (currentMusic && currentMusic.isPlaying) {
        currentMusic.stop();
    }

    // Load and play the new music track
    currentMusic = scene.sound.add(key, { volume: options.volume || 1, loop: options.loop !== undefined ? options.loop : true });
    currentMusic.play();

    return currentMusic;
}

export function playSoundEffect(scene, key, options = {}) {
    const sfx = scene.sound.add(key, { volume: options.volume || 1 });
    sfx.play();

    return sfx;
}

