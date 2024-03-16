class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    create() {
        //background
        this.background = this.add.tileSprite(0, 0, w, h, 'background').setOrigin(0, 0)
        this.stars = this.add.tileSprite(0, 0, w, h, 'stars').setOrigin(0, 0)
        this.wallTexture = this.add.tileSprite(0, 0, w, h, 'wallTexture').setOrigin(0, 0)

        //platform iterations
        this.platforms = this.physics.add.group();

        this.time.addEvent({
            delay: 1000,
            callback: this.spawnPlatform,
            callbackScope: this,
            loop: true
        });

        this.tempPlatform();

        //plasma shot iterations
        this.plasmas = this.physics.add.group();

        this.time.addEvent({
            delay: Phaser.Math.Between(2000, 4000),
            callback: this.spawnPlasma,
            callbackScope: this,
            loop: true
        });

        //create buzz
        this.buzz = new Buzz (this, this.tempPlatform.x + this.tempPlatform.width / 2, this.tempPlatform.y - 50, 'buzz');
        //buzz platform collider
        this.physics.add.collider(this.buzz, this.platforms, (buzz, platform) => {
            platform.body.immovable = true;
        });

        this.physics.add.collider(this.buzz, this.plasmas, this.gameover, null, this);

        this.zurg = new Zurg(this, game.config.width - 50, game.config.height / 2, 'zurg');
    }

    update() {
        this.stars.tilePositionX -= 1
        this.wallTexture.tilePositionY -= 1

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
        this.tempPlatform.setDisplaySize(800, 20);
        this.tempPlatform.body.allowGravity = false;
        this.tempPlatform.body.immovable = true;
        this.tempPlatform.body.setCollideWorldBounds(true);
        this.platforms.add(this.tempPlatform);

        //destroys after 5 secs
        this.time.delayedCall(10000, () => {
            this.tempPlatform.destroy();
        });
    }

    spawnPlasma() {
        const plasma = new Plasma(this, this.zurg.x, this.zurg.y);
        const velocityX = -500;
        this.sound.play('zurgAttack');
        
        //set velocity
        plasma.setVelocity(velocityX, 0);
        //delete when out of bounds
        plasma.checkOutOfBounds = true;

        //second shot after .25 second delay
        this.time.delayedCall(250, () => {
            const plasma2 = new Plasma(this, this.zurg.x, this.zurg.y);
            plasma2.setVelocity(velocityX, 0);
            plasma2.checkOutOfBounds = true;    
        });
        //third shot after .5 second delay
        this.time.delayedCall(500, () => {
            const plasma3 = new Plasma(this, this.zurg.x, this.zurg.y);
            plasma3.setVelocity(velocityX, 0);
            plasma3.checkOutOfBounds = true;    
        })
    }
    
    zurgShoot() {
        //check if Zurg has blinked before shooting
        if (this.zurg.y % 200 === 0) {
            const plasma = new Plasma(this, this.zurg.x, this.zurg.y);

            const velocityX = -500;
            plasma.setVelocity(velocityX, 0);

            plasma.checkOutOfBounds = true;
        }
    }
    
    gameover(buzz, plasma) {
        this.scene.start('Gameover');
    }
}