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
            fixedWidth: 0,
        }

        this.add.image(0,0, 'death_bg', ).setOrigin(0,0).setScale(2);
        this.chameleon = this.add.image(game.config.width/2, 210, 'death_chameleon').setOrigin(0.5,0).setScale(2);
        this.wings = this.add.image(this.chameleon.x + 38, 164, 'death_wings').setOrigin(0.5,0).setScale(2);
        this.died = this.add.image(game.config.width/2, game.config.height - 208, 'death_msg').setOrigin(0.5,0).setScale(1.8).setAlpha(0);
        this.tweens.add({
            targets: this.died,
            alpha: {value: 1, duration: 4000, ease: 'Power1'},
            scale: {value: 2, duration: 4000, ease: 'Power1'},
            duration: 1500,
            ease: 'Power0',
            repeat: 0,
            delay: 100,
        })


        let button1Pad = 276 * 2;
        let button1 = this.add.image(game.config.width/2, button1Pad, 'button2').setOrigin(0.5, 0.5).setScale(2);
        button1.setInteractive();
        this.add.text(game.config.width/2, button1.y + 2, 'MENU', menuConfig).setOrigin(0.5);

        // display final score
        // console.log("finalScore: ", this.finalScore.toFixed(2));
        let scorePad = 144;
        this.score = this.add.text(game.config.width/2, scorePad + 2, 'DISTANCE: ' + this.finalScore.toFixed(2) + 'CM', scoreConfig).setOrigin(0.5).setAlpha(0.65);

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

    update(time) {
        this.chameleon.y += 0.2 * Math.sin(time / 500);
        this.wings.y += 0.25 * Math.sin((time - 50) /500);
    }
}