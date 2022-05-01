class Death extends Phaser.Scene {
    constructor() {
        super("death");
    }

    // get score
    init (data) {
        // console.log('init', data);
        this.finalScore = data.score;
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
        let scoreConfig = {
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

        this.add.tileSprite(0,0, config.width, config.height, 'death_image', ).setOrigin(0,0).setScale(2);
        let button1Pad = 276 * 2;
        let button1 = this.add.image(game.config.width/2, button1Pad, 'button').setOrigin(0.5, 0.5).setScale(2);
        button1.setInteractive();
        this.add.text(game.config.width/2, button1.y + 2, 'MENU', menuConfig).setOrigin(0.5);

        // display final score
        // console.log("finalScore: ", this.finalScore.toFixed(2));
        let scorePad = 50;
        this.scoreBox = this.add.image(200, scorePad, 'button').setOrigin(0.5, 0.5).setScale(7, 3.5);   
        this.score = this.add.text(200, this.scoreBox.y + 2, 'DISTANCE: ' + this.finalScore.toFixed(2) + 'CM', scoreConfig).setOrigin(0.5);
        

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