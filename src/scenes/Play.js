class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    create() {
        // this.background = this.add.tileSprite(0, 0, 960, 640, 'background').setOrigin(0, 0)
        // this.stars = this.add.tileSprite(0, 0, 960, 640, 'stars').setOrigin(0, 0)
        // this.wallTexture = this.add.tileSprite(0, 0, 960, 640, 'wallTexture').setOrigin(0, 0)

        //platform iterations
        this.platforms = this.physics.add.group();

        this.time.addEvent({
            delay: 1000,
            callback: this.spawnPlatform,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // this.stars.tilePositionX -= 1
        // this.wallTexture.tilePositionY -= 1

        //destroys platforms out of bounds
        this.platforms.children.iterate(platform => {
            if (platform && platform.x !== undefined) {
                platform.x -= 1;

                if (platform.x < platform.width - 150) {
                    platform.destroy();
                }
            }
        });
    }

    //layer and spawn mechanics 
    spawnPlatform() {
        const platform_height = [100,250,400,550,700];
        Phaser.Math.RND.shuffle(platform_height); // Shuffle the array to get random heights

        for (let i = 0; i < 2; i++) {
            const layer = platform_height[i];

            // create a new instance of the Platforms class
            const platform = new Platforms(this, config.width + 150, layer);
            platform.setVelocityX(-55);
        }
    }

    gameover() {
        this.scene.start('Gameover');
    }
}
