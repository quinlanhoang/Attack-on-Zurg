class Plasma extends Phaser.Physics.Arcade.Sprite{ 
    constructor(scene, x, y) {
        super(scene, x, y, 'plasma');

        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.body.setSize(20, 15); //adjust as needed  
        this.body.setOffset(0, 0);
        
        this.setVelocityX(-500);
        this.setScale(3.5);

        scene.anims.create({
            key : 'plasma',
            frames: scene.anims.generateFrameNumbers('plasma', {start: 0, end: 3}),
            framerate: 1,
            repeat: -1
        });

        this.play('plasma', true);

        scene.plasmas.add(this);
    }
}