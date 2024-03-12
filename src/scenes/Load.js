class Load extends Phaser.Scene {
    constructor() {
        super('Load');
    }

    preload() {

        // loading bar
        // see: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();                                 // reset fill/line style
            loadingBar.fillStyle(0xFFFFFF, 1);                  // (color, alpha)
            loadingBar.fillRect(0, centerY, w * value, 5);  // (x, y, w, h)
        });
        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        
        //implement credits later
        
        this.load.path = './assets/';
        //background
        this.load.image('background', 'img/background.png')
        this.load.image('stars', 'img/stars.png')
        this.load.image('wallTexture', 'img/wallTexture.png')
        
        //special effects/animations
        

        //character graphics
        this.load.image('buzz', '/img/buzz.png')
        this.load.image('zurg', 'img/zurg.png')
        this.load.image('enemy', 'img/enemy.png')

        //other assets
        this.load.image('temp_platform', 'img/temp_platform.png')

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