class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    create() {

    }

    update() {

    }

    gameover() {
        this.scene.start('Gameover');
    }
}
