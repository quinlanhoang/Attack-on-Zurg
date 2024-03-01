class Gameover extends Phaser.Scene {
    constructor() {
        super('Gameover');
    }

    create() {

    }

    update() {

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