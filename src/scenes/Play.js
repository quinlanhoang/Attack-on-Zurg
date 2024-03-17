class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    create() {   
        //background
        this.background = this.add.tileSprite(0, 0, w, h, 'background').setOrigin(0, 0)
        this.stars = this.add.tileSprite(0, 0, w, h, 'stars').setOrigin(0, 0)
        this.wallTexture = this.add.tileSprite(0, 0, w, h, 'wallTexture').setOrigin(0, 0)

        //world boundaries
        this.physics.world.setBounds(0, 0, game.config.width, game.config.height + 100);

        //platform iterations
        this.platforms = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.time.addEvent({
            delay: 1000,
            callback: this.spawnPlatform,
            callbackScope: this,
            loop: true
        });

        //temp platform
        const tempPlatformX = game.config.width / 2 - 100; 
        const tempPlatformY = game.config.height / 2 - 100; 
        this.tempPlatform = this.physics.add.sprite(tempPlatformX, tempPlatformY, 'platform').setOrigin(0, 0);
        this.tempPlatform.displayWidth = 200; 
        this.tempPlatform.displayHeight = 20;
        this.tempPlatform.setImmovable(true);
        this.time.addEvent({
            delay: 4000, 
            callback: this.removeTemp,
            callbackScope: this
        });
    

        //plasma shot iterations
        this.plasmas = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        //laserbeam shot iterations
        this.laserbeams = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.time.addEvent({
            delay: Phaser.Math.Between(2000, 4000),
            callback: this.spawnPlasma,
            callbackScope: this,
            loop: true
        });

        //create buzz
        const buzzStartingX = game.config.width / 2;
        const buzzStartingY = tempPlatformY - 50; 
        this.buzz = new Buzz(this, buzzStartingX, buzzStartingY, 'buzz', null, this.updateHealthBars.bind(this));
        this.buzzHit = this.sound.add('buzzHit');
        //create zurg
        this.zurg = new Zurg(this, game.config.width - 50, game.config.height / 2, 'zurg', null, this.updateHealthBars.bind(this));
        this.zurgHit = this.sound.add('zurgHit');

        //collision handlers
        
        this.physics.add.collider(this.buzz, this.tempPlatform);
        this.physics.add.collider(this.buzz, this.platforms);

        this.physics.add.overlap(this.buzz, this.plasmas, this.hitBuzz, null, this);
        this.physics.add.overlap(this.zurg, this.laserbeams, this.hitZurg, null, this);

        //headshot icons
        this.buzzHeadshot = this.add.image(15 , game.config.height - 11, 'buzz_headshot').setOrigin(0, 1).setScale(3);
        this.zurgHeadshot = this.add.image(game.config.width - 15, game.config.height - 11, 'zurg_headshot').setOrigin(1, 1).setScale(3);
        //health bars
        this.buzzHealthBar = this.add.graphics();
        this.zurgHealthBar = this.add.graphics();
        //health bar positioning
        this.buzzHealthBar.setPosition(20, game.config.height - 40);
        this.zurgHealthBar.setPosition(game.config.width - 220, game.config.height - 40);

        this.createHealthBars();    
        this.updateHealthBars();

        //cooldown overlay
        this.cooldown = this.add.sprite(game.config.width / 2, game.config.height - 30, 'refresh').setScale(5);
        this.cooldown.setDepth(1);
        this.cooldown.alpha = 0;

    }

    update() {
        this.stars.tilePositionX -= 1
        this.wallTexture.tilePositionY -= 1
        
        //destroys platforms out of bounds
        this.platforms.children.iterate(platform => {
            if (platform && platform.x !== undefined) {
                platform.x -= 1;

                if (platform.x < platform.width - 150) {
                    console.log("Platform destroyed");
                    platform.destroy();
                }
            }
        });

        this.plasmas.children.iterate(plasma => {
            if (plasma && plasma.x !== undefined && plasma.checkOutOfBounds) {
                if (plasma.x < -100) {
                    console.log("Plasma destroyed");
                    plasma.destroy();
                }
            }
        });

        this.buzz.update();

        //death upon falling off
        if (this.buzz.y >  game.config.height + 45) {
            this.buzz.health = 0;
            this.updateHealthBars();
            this.gameover();
        }
        //overlay cooldown
        const currentTime = this.time.now;
        const cooldownRemaining = this.buzz.shootCooldown - (currentTime - this.buzz.lastShootTime);
        const alpha = Phaser.Math.Clamp(cooldownRemaining / this.buzz.shootCooldown, 0, 1);
        this.cooldown.alpha = 1 - alpha;
    }

    removeTemp() {
        this.tweens.add({
            targets: this.tempPlatform,
            y: game.config.height + 100, // move below the screen
            duration: 2000, 
            onComplete: () => {
                this.tempPlatform.destroy();
            }
        }); 
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

    spawnLaserbeam() {
        const laserbeam = new Laserbeam(this, this.buzz.x, this.buzz.y);
        const velocityX = 2000; // Adjust as needed
        laserbeam.setVelocityX(velocityX, 0);
        laserbeam.checkOutOfBounds = true;
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
        console.log("Buzz was hit");
        //flash red
        buzz.setTint(0xff0000);
        //shake camera
        this.cameras.main.shake(100, 0.01);
        //play audio
        this.buzzHit.play();
        //destroys upon contact
        plasma.destroy();
        console.log("Plamsa destroyed")
       //decreases health
        
       this.buzz.health -= 10;
        //updates UI
        this.updateHealthBars();
        if (buzz.health <= 0) {
            this.gameover();
        }

        //remove tint after delay
        this.time.delayedCall(200, () => {
            buzz.clearTint();
        });
    }

    hitZurg(zurg, laserbeam) {
        console.log("Zurg was hit");
        zurg.setTint(0xff0000);
        this.cameras.main.shake(500, 0.01);
        this.zurgHit.play();
        laserbeam.destroy();
        console.log("Laserbeam destroyed")
        this.zurg.health -= 50;
        this.updateHealthBars();
        if (zurg.health <= 0) {
            this.victory();
        }

        this.time.delayedCall(200, () => {
            zurg.clearTint();
        });
    }

    createHealthBars() {
        //buzz
        this.buzzHealthBorder = this.add.graphics();
        this.buzzHealthBorder.lineStyle(6, 0x000000, 1);
        this.buzzHealthBorder.strokeRect(110, game.config.height - 43, 500, 30);
        this.buzzHealthBar = this.add.graphics();
        this.buzzHealthBar.setPosition(20, game.config.height - 40);
        //zurg
        this.zurgHealthBorder = this.add.graphics();
        this.zurgHealthBorder.lineStyle(6, 0x000000, 1);
        this.zurgHealthBorder.strokeRect(880, game.config.height - 43, 500, 30);
        this.zurgHealthBar = this.add.graphics();
        this.zurgHealthBar.setPosition(game.config.width - 220, game.config.height - 40);
    }
    
    updateHealthBars() {
    // Buzz's health bar
    this.buzzHealthBar.clear();
    this.buzzHealthBar.fillStyle(0x00FF00, 1);
    const buzzHealthWidth = this.buzz.health / 100 * 500;
    const buzzHealthX = 90; 
    this.buzzHealthBar.fillRect(buzzHealthX, 0, buzzHealthWidth, 25);
    
    // Zurg's health bar
    this.zurgHealthBar.clear();
    this.zurgHealthBar.fillStyle(0xFF0000, 1);
    const zurgHealthWidth = this.zurg.health / 1000 * 500;
    const zurgHealthX =  -400; 
    this.zurgHealthBar.fillRect(zurgHealthX, 0, zurgHealthWidth, 25);
}
    
    gameover() {
        this.scene.stop('Play');
        this.scene.start('Victory');
    }

    victory() {
        this.scene.stop('Play');
        this.scene.start('Victory');
    }
}