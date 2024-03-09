class Gameover extends Phaser.Scene {
    constructor() {
        super('Gameover');
    }

    create() {
        if(localStorage.getItem('hiscore') != null) {
            let storedScore = parseInt(localStorage.getItem('hiscore'));
            if(level > storedScore) {
                //console.log(`New high score: ${level}`);
                localStorage.setItem('hiscore', level.toString());
                highScore = level;
                newHighScore = true;
            } else {
                //console.log('No new high score :/');
                highScore = parseInt(localStorage.getItem('hiscore'));
                newHighScore = false;
            }
        } else {
            //console.log('No high score stored. Creating new.');
            highScore = level;
            localStorage.setItem('hiscore', highScore.toString());
            newHighScore = true;
        }

        if(newHighScore) {
            this.add.bitmapText(centerX, centerY - textSpacer*3, 'edit', 'New Hi-Score!', 32).setOrigin(0.5);
        }
        this.add.bitmapText(centerX, centerY - textSpacer*2, 'edit', `Disintegration averted for ${level}s`, 48).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY - textSpacer, 'edit', `This browser's best: ${highScore}s`, 24).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY, 'edit', `Press SPACE BAR to Restart`, 36).setOrigin(0.5);

        // add credits text
        this.add.bitmapText(centerX, centerY + textSpacer, 'edit', 'Music from Bensound', 24).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer*1.5, 'edit', 'Sound effects from Pixabay', 24).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer*2, 'edit', 'Game play inspired by Nathan Altice', 24).setOrigin(0.5);

        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            let textureManager = this.textures;
            console.log(textureManager)
            // take snapshot of the entire game viewport (same as title screen)
            this.game.renderer.snapshot((snapshotImage) => {
                console.log('took snapshot in GameOver')
                if(textureManager.exists('titlesnapshot')) {
                    textureManager.remove('titlesnapshot');
                }
                textureManager.addImage('titlesnapshot', snapshotImage);
            });

            // start next scene
            this.scene.start('Play');
        }
    }

    // restartGame() {
    //     this.scene.stop('Gameover');
    //     this.scene.start('Play');
    // }

    // title() {
    //     this.scene.stop('Gameover');
    //     this.scene.start('Title');
    // }
}