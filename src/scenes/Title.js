class Title extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    create() {
        
        //main title text
        const title = this.add.bitmapText(centerX, centerY - 150, 'edit_font', 'Attack on Zurg', 95).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY - 75, 'edit_font', 'Use WASD keys to move and space to shoot', 50).setOrigin(0.5);

        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.enter)) {
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
            this.scene.start('Play');
        }
    }
}