class Load extends Phaser.Scene {
    constructor() {
        super('Load');
    }

    preload() {

    }

    create() {
        this.scene.start('Title');
    }
}