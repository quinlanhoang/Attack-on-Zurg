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

        this.tempPlatform();

        //create buzz
        this.buzz = new Buzz (this, this.tempPlatform.x + this.tempPlatform.width / 2, this.tempPlatform.y - 50, 'buzz');
        //buzz platform collider
        this.physics.add.collider(this.buzz, this.platforms, (buzz, platform) => {
            platform.body.immovable = true;
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

        this.buzz.update();
    }

    //layer and spawn mechanics 
    spawnPlatform() {
        const platform_height = [200,400,600,800];
        Phaser.Math.RND.shuffle(platform_height); // Shuffle the array to get random heights

        for (let i = 0; i < 2; i++) {
            const layer = platform_height[i];

            // create a new instance of the Platforms class
            const platform = new Platforms(this, config.width + 150, layer);
            platform.setVelocityX(-65);
        }
    }

    tempPlatform() {
        const tempPlatformX = 0;
        const tempPlatformY = config.height / 2;
        
        this.tempPlatform = new Platforms(this, tempPlatformX, tempPlatformY);
        this.tempPlatform.setDisplaySize(200, 20);
        this.tempPlatform.body.allowGravity = false;
        this.tempPlatform.body.immovable = true;
        this.tempPlatform.body.setCollideWorldBounds(true);
        this.platforms.add(this.tempPlatform);

        //destroys after 5 secs
        this.time.delayedCall(5000, () => {
            this.tempPlatform.destroy();
        });
    }
    

    gameover() {
        this.scene.start('Gameover');
    }
}