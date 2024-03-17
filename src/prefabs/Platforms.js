class Platforms extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'platform');

        scene.add.existing(this);
        scene.physics.world.enable(this);

        // set the size of the platform as needed
        this.setDisplaySize(180, 20); // adjust as needed
        
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.body.setCollideWorldBounds(true);

        // add this platform to the existing platforms group in the Play scene
        scene.platforms.add(this);

        //platform gravity timer
        this.timer = null;
        this.timerStarted = false;
    }
}
