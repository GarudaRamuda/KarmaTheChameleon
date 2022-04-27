class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    preload() {        
        this.load.image('menu', './assets/menu.png');
    }

    create () {
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#1fbbcf',
            color: '#ffffff',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.death = this.add.tileSprite(0,0, config.width, config.height, 'menu', ).setOrigin(0,0).setScale(2);        
        this.add.text(game.config.width/2, game.config.height - 15, 'S to start', menuConfig).setOrigin(0.5);
        
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }

    update () {        
        if (Phaser.Input.Keyboard.JustDown(this.keyS)) {                        
            this.scene.start('play');    
          }        
    }    
}