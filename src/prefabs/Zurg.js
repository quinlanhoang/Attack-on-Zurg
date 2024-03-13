class Zurg extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this);
        scene.physics.world.enable(this);

        //initialize last position
        this.lastPosition = null;
        
        //initalize blinking
        this.blinkZurg();
    }

    blinkZurg() {
        //generate random position and prohibit from blinking in the same position consecutively
        let newY = Phaser.Math.RND.pick([100, 300, 500, 700]);
        while (newY === this.lastPosition) {
            newY = Phaser.Math.RND.pick([100, 300, 500, 700]);
        }

        //update last position
        this.lastPosition = newY;
        //blink to position
        this.setPosition(this.x, newY);
        
        //timer for next blink 
        const nextBlink = Phaser.Math.RND.between(2000, 4000);
        this.scene.time.delayedCall(nextBlink, this.blinkZurg , [], this);

    }
}
    