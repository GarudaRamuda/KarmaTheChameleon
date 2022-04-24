let config = {
    type: Phaser.CANVAS,
    width:640,
    height:480,
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 1.5
            },
            debug: true,
        }
    },
    scene: [Play],
    pixelArt: true,
    fps: {
        target: 60,
        forceSetTimeOut: true
     }
};

let game = new Phaser.Game(config);
let pointer, keyA, keyD, keyW;
game.maxHeight = 0;