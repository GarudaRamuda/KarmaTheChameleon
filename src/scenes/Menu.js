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
        this.bg_far = this.add.tileSprite(0,0, 528, 288, 'img_bg_far').setOrigin(0,0).setScale(2);
        this.bg_mid2 = this.add.tileSprite(0,0, 528, 288, 'img_bg_mid2').setOrigin(0,0).setScale(2);
        this.bg_mid = this.add.tileSprite(0,0, 528, 288, 'img_bg_mid').setOrigin(0,0).setScale(2);
        this.bg_close = this.add.tileSprite(0,0, 528, 288, 'img_bg_close').setOrigin(0,0).setScale(2);
        this.logo = this.add.image(config.width/2, 20, 'logo').setOrigin(0.5,0).setScale(2); 
        let button1 = this.add.image(game.config.width/2, button1Pad, 'button').setOrigin(0.5, 0.5).setScale(2);
        let button2 = this.add.image(game.config.width/2, button2Pad, 'button').setOrigin(0.5, 0.5).setScale(2);   
        button1.setInteractive();
        button2.setInteractive();        
        this.add.text(game.config.width/2, button1.y + 2, 'PLAY!', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, button2.y + 2, 'QUIT', menuConfig).setOrigin(0.5);
        this.menuSong = this.sound.add('song_drums', {loop: true});
        this.menuSong.play();

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
            this.menuSong.stop();
            this.scene.start('play');
        });
        // Nuke it
        button2.on('pointerdown', () => {
            game.destroy(true);
        });
    }

    update(time) {
        this.bg_far.tilePositionX += .5;
        this.bg_mid2.tilePositionX += .8;
        this.bg_mid.tilePositionX += 1.1;
        this.bg_close.tilePositionX += 1.5;
        this.logo.y += 0.6 * Math.sin(time / 500.0);
    }
}