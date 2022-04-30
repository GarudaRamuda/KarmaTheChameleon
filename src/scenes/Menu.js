class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create () {
        let menuConfig = {
            fontFamily: 'stockyPixels',
            fontSize: '16px',
            color: '#f5ffe8',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        let button1Pad = 234 * 2;
        let button2Pad = button1Pad + (32 * 2);
        this.add.tileSprite(0,0, config.width, config.height, 'menu', ).setOrigin(0,0).setScale(2);    
        let button1 = this.add.image(game.config.width/2, button1Pad, 'button').setOrigin(0.5, 0.5).setScale(2);
        let button2 = this.add.image(game.config.width/2, button2Pad, 'button').setOrigin(0.5, 0.5).setScale(2);   
        button1.setInteractive();
        button2.setInteractive();        
        this.add.text(game.config.width/2, button1.y + 2, 'PLAY!', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, button2.y + 2, 'QUIT', menuConfig).setOrigin(0.5);

        // Change Alpha on buttons
        button1.on('pointerover', () => {
            button1.alpha = 0.5;
            button1.setScale(2.2);
        });
        button1.on('pointerout', () => {
            button1.alpha = 1;
            button1.setScale(2);
        });
        button2.on('pointerover', () => {
            button2.alpha = 0.5;
            button2.setScale(2.2);
        });
        button2.on('pointerout', () => {
            button2.alpha = 1;
            button2.setScale(2);
        });

        // Got to Play scene
        button1.on('pointerdown', () => {
            this.scene.start('play');
        });
        // Nuke it
        button2.on('pointerdown', () => {
            game.destroy(true);
        });
    }
}