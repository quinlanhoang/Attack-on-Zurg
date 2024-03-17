//Quinlan Hoang & Amber Hsuing
//Attack on Zurg

//main
'use strict';

//define and config main Phaser game object
let config = {
    parent : 'myGame',
    type : Phaser.AUTO,
    width : 1500,
    height : 1000,
    scale : {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics : {
        default : 'arcade',
        arcade : {
            debug: true
        }
    },
    scene: [Load, Title, Play, Gameover, Victory]
};

//defines game
let game = new Phaser.Game(config);

//define globals 
let centerX = game.config.width/2; //used
let centerY = game.config.height/2; //used
let w = game.config.width; //used
let h = game.config.height; //used
let level;
let highScore;
let newHighScore = false;
let cursors;