class Title extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    create() {

    }

    startGame() {
        this.scene.start('Play');
    }
}