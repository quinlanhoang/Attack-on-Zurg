class Laserbeam extends Phaser.Physics.Arcade.Sprite{ 
    constructor(scene, x, y) {
        super(scene, x, y, 'laserbeam');

        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setVelocityX(1000);
        this.setScale(3);

        scene.anims.create({
            key : 'laser',
            frames: scene.anims.generateFrameNumbers('laserbeam', {start: 3, end: 0}),
            framerate: 50,
            repeat: -1
        });

        this.play('laser', true);

        this.checkoutOfBounds = true;
    }
}