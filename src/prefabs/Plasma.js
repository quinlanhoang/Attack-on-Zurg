class Plasma extends Phaser.Physics.Arcade.Sprite{ 
    constructor(scene, x, y) {
        super(scene, x, y, 'plasma');

        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setVelocityX(-500);
        this.setScale(3);

        scene.anims.create({
            key : 'fired',
            frames: scene.anims.generateFrameNumbers('plasma', {start: 0, end: 4}),
            framerate: 1,
            repeat: -1
        });

        this.play('fired', true);
    }
}