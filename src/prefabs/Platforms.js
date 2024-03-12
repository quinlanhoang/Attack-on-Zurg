class Platforms extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'temp_platform');

        scene.add.existing(this);
        scene.physics.world.enable(this);

        // set the size of the platform as needed
        this.setDisplaySize(200, 20); // adjust as needed
        
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.body.setCollideWorldBounds(true);

        // add this platform to the existing platforms group in the Play scene
        scene.platforms.add(this);
    }
}
