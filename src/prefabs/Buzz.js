class Buzz extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, healthChangedCallback) { 
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.world.enable(this);

        //audio implementations
        this.jumpSound = scene.sound.add('jump');
        this.buzzAttack = scene.sound.add('buzzAttack')

        //buzz physics
        this.setCollideWorldBounds(true);
        this.body.setSize(25, 70).setOffset(0,0); //adjust as needed   
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
        this.shootCooldown = 1500; //cooldown period

        //health properties
        this.health = 100;
        this.healthChangedCallback = healthChangedCallback;

    }

    update() {
        //handle player key input
        if (this.keys.up.isDown && this.body.onFloor()) {
            this.setVelocityY(-500); //adjust as needed
            //this.stateMachine.transition('buzz-jump')
            this.anims.play('jump')
            this.body.setSize(35, 70).setOffset(20, 20);
            this.jumpSound.play();
            //this.stateMachine.transition('idle')
        }

        if (this.keys.left.isDown) {
            this.anims.play('walk')
            this.setVelocityX(-300);
            //this.stateMachine.transition('buzz-walk')
            
            this.body.setSize(45, 80).setOffset(0, 20);
            
            //this.stateMachine.transition('idle')
        }

        else if(this.keys.right.isDown) {
            this.setVelocityX(300);
            this.anims.play('walk')
            this.body.setSize(45, 80).setOffset(0, 20);
            //this.stateMachine.transition('buzz-walk')
            //this.stateMachine.transition('idle')
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

        this.buzzAttack.play();
        const laserbeam = new Laserbeam(this.scene, this.x, this.y);
        const velocityX = 2000; // Adjust as needed
        laserbeam.setVelocityX(velocityX, 0);
        this.lastShootTime = currentTime;
    }

    updateHealth(newHealth) {
        this.health = newHealth;
        
        if (this.healthChangedCallback) {
            this.healthChangedCallback(newHealth);
        }
    }
}

// class IdleState extends State {
//     // enter(scene, buzz) {
//     //     return
//     // }    
    
//     execute(scene, buzz) {
//         //const { up, left, right, down } = scene.cursors

//         if (buzz.keys.up.isDown && buzz.body.onFloor()) {
//             buzz.setVelocityY(-500);
//             this.stateMachine.transition('buzz-jump')
//             buzz.jumpSound.play();
//             this.stateMachine.transition('idle')
//             return
//         }

//         if (buzz.keys.down.isDown) {
//             this.stateMachine.transition('buzz-crouch')
//             this.stateMachine.transition('idle')
//             return
//         }

//         if (buzz.keys.left.isDown) {
//             buzz.setVelocityX(-300);
//             this.stateMachine.transition('buzz_walk')
//             this.stateMachine.transition('idle')
//             return
//         }

//         if (buzz.keys.right.isDown) {
//             buzz.setVelocityX(300);
//             this.stateMachine.transition('buzz_walk')
//             this.stateMachine.transition('idle')
//             return
//         }
//     }
// }

// class RunState extends State {
//     enter(scene, buzz) {
//         if (buzz.health <= 0) {
//             return
//         }
//         buzz.anims.play('buzz_walk')
//     }  
//     execute(scene, buzz) {
//         //const {up, left, right, down } = scene.cursors

//         if (buzz.keys.up.isDown && buzz.body.onFloor()) {
//             buzz.setVelocityY(-500);
//             this.stateMachine.transition('buzz-jump')
//             buzz.jumpSound.play();
//             this.stateMachine.transition('idle')
//             return
//         }

//         if (buzz.keys.down.isDown) {
//             this.stateMachine.transition('buzz-crouch')
//             this.stateMachine.transition('idle')
//             return
//         }

//         if (buzz.keys.left.isDown) {
//             buzz.setVelocityX(-300);
//             this.stateMachine.transition('buzz_walk')
//             this.stateMachine.transition('idle')
//             return
//         }

//         if (buzz.keys.right.isDown) {
//             buzz.setVelocityX(300);
//             this.stateMachine.transition('buzz_walk')
//             this.stateMachine.transition('idle')
//             return
//         }
//     }
// }

// class CrouchState extends State {
//     enter(scene, buzz) {
//         if (buzz.health <= 0) {
//             return
//         }
//         buzz.anims.play('buzz-crouch')
//     }  
//     execute(scene, buzz) {
//         //const {up, left, right, down } = scene.cursors

//         if (buzz.keys.up.isDown && buzz.body.onFloor()) {
//             buzz.setVelocityY(-500);
//             this.stateMachine.transition('buzz-jump')
//             buzz.jumpSound.play();
//             this.stateMachine.transition('idle')
//             return
//         }

//         if (buzz.keys.down.isDown) {
//             this.stateMachine.transition('buzz-crouch')
//             this.stateMachine.transition('idle')
//             return
//         }

//         if (buzz.keys.left.isDown) {
//             buzz.setVelocityX(-300);
//             this.stateMachine.transition('buzz_walk')
//             this.stateMachine.transition('idle')
//             return
//         }

//         if (buzz.keys.right.isDown) {
//             buzz.setVelocityX(300);
//             this.stateMachine.transition('buzz_walk')
//             this.stateMachine.transition('idle')
//             return
//         }
//     }
// }

// class JumpState extends State {
//     enter(scene, buzz) {
//         if (buzz.health <= 0) {
//             return
//         }
//         buzz.anims.play('buzz-jump')
//     }  
//     execute(scene, buzz) {
//         //const {up, left, right, down } = scene.cursors

//         if (buzz.keys.up.isDown && buzz.body.onFloor()) {
//             buzz.setVelocityY(-500);
//             this.stateMachine.transition('buzz-jump')
//             buzz.jumpSound.play();
//             this.stateMachine.transition('idle')
//             return
//         }

//         if (buzz.keys.down.isDown) {
//             this.stateMachine.transition('buzz-crouch')
//             this.stateMachine.transition('idle')
//             return
//         }

//         if (buzz.keys.left.isDown) {
//             buzz.setVelocityX(-300);
//             this.stateMachine.transition('buzz_walk')
//             this.stateMachine.transition('idle')
//             return
//         }

//         if (buzz.keys.right.isDown) {
//             buzz.setVelocityX(300);
//             this.stateMachine.transition('buzz_walk')
//             this.stateMachine.transition('idle')
//             return
//         }
//     } 
//}