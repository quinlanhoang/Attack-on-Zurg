class Buzz extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, healthChangedCallback) { 
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.world.enable(this);

        //audio implementations
        this.jumpSound = scene.sound.add('jump');

        //buzz physics
        this.setCollideWorldBounds(true);
        this.body.setSize(40, 80); //adjust as needed
        this.body.allowGravity = true;

        //define hotkeys for movement
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        //shooting properties 
        this.lastShootTime = 0;
        this.shootCooldown = 10000; //cooldown period

        //health properties
        this.health = 100;
        this.healthChangedCallback = healthChangedCallback;
    }

    update() {
        //handle player key input
        if (this.keys.up.isDown && this.body.onFloor()) {
            this.setVelocityY(-500); //adjust as needed
            this.jumpSound.play();

        }

        if (this.keys.left.isDown) {
            this.setVelocityX(-300);
        }

        else if(this.keys.right.isDown) {
            this.setVelocityX(300);
        }

        else {
            this.setVelocityX(0);
        }

        if (!this.body.onFloor()) {
            this.setGravityY(500);
        }
        
        else {
            this.setGravityY(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            this.shootLaser();
        }
    }

    shootLaser() {
        //cooldown checker
        const currentTime = this.scene.time.now;
        if (currentTime - this.lastShootTime < this.shootCooldown) {
            return; //exits if still in cooldown
        } 

        const laserbeam = new Laserbeam(this.scene, this.x, this.y);
        
        this.lastShootTime = currentTime;
    }

    updateHealth(newHealth) {
        this.health = newHealth;
        
        if (this.healthChangedCallback) {
            this.healthChangedCallback(newHealth);
        }
    }
}
