class Title extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    create() {
        
        //main title text
        const title = this.add.bitmapText(centerX, centerY - 150, 'edit', 'Attack on Zurg', 95).setOrigin(0.5);
        let instruct = this.add.bitmapText(centerX, centerY - 75, 'edit', 'Use WASD keys to move and space to shoot', 50).setOrigin(0.5);
        let start = this.add.bitmapText(centerX, centerY - 25, 'edit', 'Press space to start game', 50).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            duration: 2500,
            angle: { from: -1, to: 1 },
            yoyo: true,
            repeat: -1,
            onYoyo: function() {
                this.cameras.main.shake(100, 0.0025);
            },
            onYoyoScope: this
        });

        this.tweens.add({
            targets: instruct,
            duration: 2500,
            angle: { from: -1, to: 1 },
            yoyo: true,
            repeat: -1,
            onYoyo: function() {
                this.cameras.main.shake(100, 0.0025);
            },
            onYoyoScope: this
        });

        this.tweens.add({
            targets: start,
            duration: 2500,
            angle: { from: -1, to: 1 },
            yoyo: true,
            repeat: -1,
            onYoyo: function() {
                this.cameras.main.shake(100, 0.0025);
            },
            onYoyoScope: this
        });

        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
            let textureManager = this.textures;
            // take snapshot of the entire game viewport
            // https://newdocs.phaser.io/docs/3.55.2/Phaser.Renderer.WebGL.WebGLRenderer#snapshot
            // .snapshot(callback, type, encoderOptions)
            // the image is automatically passed to the callback
            this.game.renderer.snapshot((snapshotImage) => {
                // make sure an existing texture w/ that key doesn't already exist
                if(textureManager.exists('titlesnapshot')) {
                    textureManager.remove('titlesnapshot');
                }
                // take the snapshot img returned from callback and add to texture manager
                textureManager.addImage('titlesnapshot', snapshotImage);
            });
            this.scene.start('Dialogue');
        }
    }
}