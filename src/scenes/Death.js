class Death extends Phaser.Scene {
    constructor() {
        super("death");
    }

    preload() {        
        this.load.image('death_image', './assets/death.png');
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

        this.death = this.add.tileSprite(0,0, config.width, config.height, 'death_image', ).setOrigin(0,0).setScale(2);        
        this.add.text(game.config.width/2, game.config.height - 15, 'R to restart or M for menu', menuConfig).setOrigin(0.5);
        
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    }

    update () {
        
        if (Phaser.Input.Keyboard.JustDown(this.keyR)) {                        
            this.scene.start('play');    
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyM)) {            
            this.scene.start('menu');                        
        }
    }
    
}