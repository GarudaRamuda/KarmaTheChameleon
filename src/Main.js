let config = {
    type: Phaser.CANVAS,
    width:1024,
    height:576,
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 1.5
            },
        }
    },
    pixelArt: true,
    fps: {
        target: 60,
        forceSetTimeOut: false
    },
    scene: [Load, Menu, Play, Death]
};

let game = new Phaser.Game(config);
let pointer, keyA, keyD, keyW, keySPACE;
game.maxHeight = 0;
