//Quinlan Hoang & Amber Hsuing
//Attack on Zurg

//main

//define and config main Phaser game object
let config = {
    parent : 'myGame',
    type : Phaser.AUTO,
    width : 1200,
    height : 680,
    scale : {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics : {
        default : 'arcade',
        arcade : {
            //debug: true
        }
    },
    scene: [Load, Title, Play, Gameover],
};

//defines game
let game = new Phaser.Game(config);

//define globals (?)