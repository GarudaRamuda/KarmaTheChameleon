let config = {
    type: Phaser.CANVAS,
    width:640,
    height:480,
    physics: {
        default: 'matter',
        arcade: {
            gravity: {
                y: 300
            },
            debug: true,
            debugBodyColor: 0xffffff
        },
        matter: {
            gravity: {
                y: 2.8
            },
            debug: true,
        }
    },
    scene: [Play]
};

let game = new Phaser.Game(config);
let pointer, keyA, keyD, keySPACE;
game.maxHeight = 0;