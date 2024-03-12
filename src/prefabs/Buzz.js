class Buzz extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) { 
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
        });
    }

    update() {
        //handle player key input
        if (this.keys.up.isDown && this.body.onFloor()) {
            this.setVelocityY(-500); //adjust as needed
            this.jumpSound.play();

        }

        if (this.keys.left.isDown) {
            this.setVelocityX(-200);
        }

        else if(this.keys.right.isDown) {
            this.setVelocityX(200);
        }

        else {
            this.setVelocityX(0);
        }

        if (!this.body.onFloor()) {
            this.setGravityY(300);
        }
        
        else {
            this.setGravityY(0);
        }
    }

}
