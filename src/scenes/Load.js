class Load extends Phaser.Scene {
    constructor() {
        super('Load');
    }

    preload() {
        //implement credits later

        //fonts
        //font by Ænigma
        this.load.bitmapFont('edit_font', 'assets/fonts/Edit_Undo_Line-1.png', 'assets/fonts/Edit_Undo_Line-1.xml');

    }

    create() {
        this.scene.start('Title');
    }
}