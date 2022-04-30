class Load extends Phaser.Scene {
    constructor() {
        super('load');
    }

    preload() {
        this.load.image('menu', './assets/menu.png');
        this.load.image('button', './assets/button.png');
        this.load.image('death_image', './assets/death.png');
        //load sounds
        this.load.audio('sound_stick', './assets/sounds/stick.wav');
        this.load.audio('sound_jump', './assets/sounds/jump.wav');
        this.load.audio('sound_land', './assets/sounds/land.wav');

        //load images

        // background images
        this.load.image('img_bg_close', './assets/back_close.png');
        this.load.image('img_bg_mid', './assets/back_mid.png');
        this.load.image('img_bg_mid2', './assets/back_mid2.png');
        this.load.image('img_bg_far', './assets/back_far.png');

        this.load.atlas('play', './assets/spritesheet.png', './assets/sprites.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.image('ground', './assets/ground.png');
        this.load.image('grappleBranch', './assets/grappleBranch.png');
        this.load.image('collision', './assets/collisionmask.png');
        this.load.image('grappleMask', './assets/grappleMask.png');
        this.load.plugin('rexrotatetoplugin', './lib/rexrotatetoplugin.min.js' , true); // load plugin for rotate
    }

    create() {
        this.scene.start('menu');
    }
}