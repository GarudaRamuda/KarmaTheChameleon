class Death extends Phaser.Scene {
    constructor() {
        super("death");
    }

    create () {
        let menuConfig = {
            fontFamily: 'stockyPixels',
            fontSize: '16px',
            color: '#fa0251',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.tileSprite(0,0, config.width, config.height, 'death_image', ).setOrigin(0,0).setScale(2);
        let button1Pad = 276 * 2;
        let button1 = this.add.image(game.config.width/2, button1Pad, 'button').setOrigin(0.5, 0.5).setScale(2);
        button1.setInteractive();
        this.add.text(game.config.width/2, button1.y + 2, 'MENU', menuConfig).setOrigin(0.5);

        // Change Alpha on button
        button1.on('pointerover', () => {
            button1.alpha = 0.1;
        });
        button1.on('pointerout', () => {
            button1.alpha = 1;
        });

        // Go to Menu Scene
        button1.on('pointerdown', () => {
            this.scene.start('menu');
        });
    }
}