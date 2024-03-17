class Gameover extends Phaser.Scene {
    constructor() {
        super('Gameover');
    }

    create() {
        //background
        this.add.image(centerX, centerY, 'gameover').setScale(3);
        const overlay = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000, 0.5).setOrigin(0);

        const gameover = this.add.bitmapText(centerX, centerY - 100, 'edit', 'GAME OVER', 200).setOrigin(0.5).setTint(0x9ACD32);

        this.time.addEvent({
            delay: 3000, 
            callback: this.shakeCamera,
            callbackScope: this,
            loop: true 
        });

        this.input.keyboard.on('keydown-R', this.restartGame, this);
        this.input.keyboard.on('keydown-T', this.title, this);
    }
    
    shakeCamera() {
        this.cameras.main.shake(500, 0.01);

        //also adds restart and title options
        const restart = this.add.bitmapText(centerX, centerY + 100, 'edit', 'PRESS R TO RESTART', 50).setOrigin(0.5).setTint(0xFFFFFF);
        const title = this.add.bitmapText(centerX, centerY + 175, 'edit', 'PRESS T TO RETURN TO TITLE', 50).setOrigin(0.5).setTint(0xFFFFFF);
    }

    restartGame() {
        this.scene.stop('Gameover');
        this.scene.start('Play');
    }

    title() {
        this.scene.stop('Gameover');
        this.scene.start('Title');
    }
}