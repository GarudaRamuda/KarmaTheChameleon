class Load extends Phaser.Scene {
    constructor() {
        super('load');
    }

    preload() {

        // load plugins
        this.load.plugin('rexrotatetoplugin', './lib/rexrotatetoplugin.min.js' , true); // load plugin for rotate

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

        // sprites
        this.load.atlas('play', './assets/spritesheet.png', './assets/sprites.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.image('ground', './assets/ground.png');
        this.load.image('grappleBranch', './assets/grappleBranch.png');
        this.load.image('branch_sm', './assets/branch_sm.png');
        this.load.image('branch_lg', './assets/branch_lg.png');
        this.load.image('collision', './assets/collisionmask.png');
        this.load.image('grappleMask', './assets/grappleMask.png');
        this.load.image('spr_tongue', './assets/tongue.png');
        this.load.image('keys', './assets/keys.png');

        // Menu assets
        this.load.image('menu', './assets/menubg.png');
        this.load.image('logo', './assets/logo.png');
        this.load.image('button', './assets/button.png');

        // Death screen
        this.load.image('button2', './assets/button2.png');
        this.load.image('death_bg', './assets/death_bg.png');
        this.load.image('death_chameleon', './assets/deadChameleon.png');
        this.load.image('death_wings', './assets/wings.png');
        this.load.image('death_msg', './assets/youDied.png');

        // Load Sounds
        this.load.audio('song_drums', './assets/Music/Menu_Loop.wav');
        this.load.audio('song_intro', './assets/Music/Song Intro.wav');
        this.load.audio('song_loop', './assets/Music/Song Loop.wav')
        this.load.audio('sound_birds', './assets/sounds/Sound_birds.wav');
        this.load.audio('sound_jungle', './assets/sounds/Sound_jungle.wav');
    }

    create() {
        this.scene.start('menu');
    }
}