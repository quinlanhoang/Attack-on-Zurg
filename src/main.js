//Quinlan Hoang & Amber Hsuing
//Attack on Zurg

//main

//define and config main Phaser game object
let config = {
    parent : 'myGame',
    type : Phaser.AUTO,
    width : 1500,
    height : 670,
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

//define globals 
let centerX = game.config.width/2;
let centerY = game.config.height/2;
let w = game.config.width;
let h = game.config.height;

let level;
let highScore;
let newHighScore = false;
let cursors;