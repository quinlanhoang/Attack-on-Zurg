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
        this.buzz = new Buzz(this, this.tempPlatform.x + this.tempPlatform.width / 2, this.tempPlatform.y - 50, 'buzz', null, this.updateHealthBars.bind(this));
        //create zurg
        this.zurg = new Zurg(this, game.config.width - 50, game.config.height / 2, 'zurg', null, this.updateHealthBars.bind(this));

        //collision handlers
        this.physics.add.collider(this.buzz, this.platforms, (buzz, platform) => {
            platform.body.immovable = true;
        });

        this.physics.add.overlap(this.buzz, this.plasmas, this.hitBuzz, null, this);
        this.physics.add.overlap(this.zurg, this.laserbeam, this.hitZurg, null, this);

        //headshot icons
        this.buzzHeadshot = this.add.image(15 , game.config.height - 15, 'buzz_headshot').setOrigin(0, 1).setScale(3);
        this.zurgHeadshot = this.add.image(game.config.width - 15, game.config.height - 15, 'zurg_headshot').setOrigin(1, 1).setScale(3);
        //health bars
        this.buzzHealthBar = this.add.graphics();
        this.zurgHealthBar = this.add.graphics();
        //health bar positioning
        this.buzzHealthBar.setPosition(20, game.config.height - 40);
        this.zurgHealthBar.setPosition(game.config.width - 220, game.config.height - 40);

        this.updateHealthBars();

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

    hitBuzz(buzz, plasma) {
        //destroys upon contact
        plasma.destroy();
       //decreases health
        buzz.health -= 10;
        //updates UI
        this.updateHealthBars();
        if (buzz.health <= 0) {
            this.gameover();
        }
    }

    hitZurg(zurg, laserbeam) {
        laserbeam.destroy();
        zurg.health -= 50;
        this.updateHealthBars();
        if (zurg.health <= 0) {
            this.gameover();
        }
    }

    updateHealthBars(newHealth) {
    // Buzz's health bar
    this.buzzHealthBar.clear();
    this.buzzHealthBar.fillStyle(0x00FF00, 1);
    const buzzHealthWidth = this.buzz.health / 100 * 500;
    this.buzzHealthBar.fillRect(20, game.config.height - 40, buzzHealthWidth, 20);
    
    // Zurg's health bar
    this.zurgHealthBar.clear();
    this.zurgHealthBar.fillStyle(0xFF0000, 1);
    const zurgHealthWidth = this.zurg.health / 1000 * 500;
    this.zurgHealthBar.fillRect(game.config.width - 220, game.config.height - 40, zurgHealthWidth, 20);
}
    
    gameover(buzz, plasma) {
        this.scene.start('Gameover');
    }
}