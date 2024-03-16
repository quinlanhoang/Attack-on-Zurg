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
        this.load.image('background', 'img/background.png');
        this.load.image('stars', 'img/stars.png');
        this.load.image('wallTexture', 'img/wallTexture.png');
        
        //special effects/animations
        

        //character graphics
        this.load.image('buzz', '/img/buzz.png');
        this.load.image('buzz_headshot', '/img/buzz_headshot.png');
        this.load.image('zurg_headshot', '/img/zurg_headshot.png');
        this.load.image('zurg', 'img/zurg.png');
        this.load.image('enemy', 'img/enemy.png');

        //other assets
        this.load.image('temp_platform', 'img/temp_platform.png');
        this.load.spritesheet('plasma', 'img/plasma.png', {frameWidth: 60, frameHeight: 13});
        this.load.spritesheet('laserbeam', 'img/laserbeam.png', {frameWidth: 40, frameHeight: 3});

        //audio
        // this.load.audio('death')
        // this.load.audio('laser')
        // this.load.audio('enemyShoot')
        this.load.audio('jump', '/audio/woosh.mp3');
        this.load.audio('zurgAttack', 'audio/zurgAttack.mp3');

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