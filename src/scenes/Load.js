class Load extends Phaser.Scene {
    constructor() {
        super('Load');
    }

    preload() {
        //implement credits later
        
        this.load.path = './assets/';
        //background
        
        //special effects/animations
        

        //character graphics
        this.add.image('buzz', 'img/buzz.png')
        this.add.image('zurg', 'img/zurg.png')

        //audio
        this.load.audio('death')
        this.load.audio('laser')
        this.load.audio('enemyShoot')

        //font by Ænigma
        this.load.bitmapFont('edit_font', 'fonts/Edit_Undo_Line-1.png', 'fonts/Edit_Undo_Line-1.xml');

    }

    create() {
        //checks for local storage
        if(window.localStorage) {
            console.log('Local storage supported');
        } else {
            console.log('Local storage not supported');
        }
        //go to title
        this.scene.start('Title');
    }
}