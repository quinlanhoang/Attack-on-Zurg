class Victory extends Phaser.Scene {
    constructor() {
        super('Victory');
    }

    create() {
        //background
        this.add.image(centerX, centerY, 'victory').setScale(1.25);
        const overlay = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000, 0.5).setOrigin(0);

        const victory = this.add.bitmapText(centerX, centerY - 100, 'edit', 'YOU WIN', 200).setOrigin(0.5).setTint(0xCBC3E3);  
        
        this.time.addEvent({
            delay: 3000, 
            callback: this.shakeCamera,
            callbackScope: this,
            loop: true 
        });

        this.input.keyboard.on('keydown-T', this.title, this);
        
    }

    shakeCamera() {
        this.cameras.main.shake(500, 0.01);

        //also adds restart and title options
        const title = this.add.bitmapText(centerX, centerY + 100, 'edit', 'PRESS T TO RETURN TO TITLE', 50).setOrigin(0.5).setTint(0xFFFFFF);
    }

    title() {
        this.scene.stop('Victory');
        this.scene.start('Title');
    }
}