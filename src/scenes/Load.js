class Load extends Phaser.Scene {
    constructor() {
        super('Load');
    }

    preload() {
        //implement credits later
        
        this.load.path = './assets/';
        //background
        this.add.image('background', 'img/background.png')
        this.add.image('stars', 'img/stars.png')
        this.add.image('wallTexture', 'img/wallTexture.png')
        
        //special effects/animations
        

        //character graphics
        this.add.image('buzz', 'img/buzz.png')
        this.add.image('zurg', 'img/zurg.png')

        //audio
        // this.load.audio('death')
        // this.load.audio('laser')
        // this.load.audio('enemyShoot')

        //font by Ænigma
        this.load.bitmapFont('edit', 'fonts/edit.png', 'fonts/edit.xml');

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