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
            /*debug: {
                showBody: false,
            }*/
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    scene: [Load, Menu, Play, Death],
    callbacks: {
        postBoot: function (game) {
          // In v3.15, you have to override Phaser's default styles
          game.canvas.style.width = '100%';
          game.canvas.style.height = '100%';
        }
    }
};

let game = new Phaser.Game(config);
let pointer, keyA, keyD, keyW, keySPACE;
game.maxHeight = 0;
