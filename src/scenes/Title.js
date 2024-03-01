class Title extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    create() {
        
        //main title text
        const title = this.add.bitmapText(centerX, centerY - 150, 'edit_font', 'Attack on Zurg', 95).setOrigin(0.5);

    }

    startGame() {
        this.scene.start('Play');
    }
}