class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    create() {
        // this.background = this.add.tileSprite(0, 0, 960, 640, 'background').setOrigin(0, 0)
        // this.stars = this.add.tileSprite(0, 0, 960, 640, 'stars').setOrigin(0, 0)
        // this.wallTexture = this.add.tileSprite(0, 0, 960, 640, 'wallTexture').setOrigin(0, 0)
    }

    update() {

        // this.stars.tilePositionX -= 1
        // this.wallTexture.tilePositionY -= 1

    }

    gameover() {
        this.scene.start('Gameover');
    }
}
