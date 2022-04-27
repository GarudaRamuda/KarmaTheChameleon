class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {

        //load sounds
        this.load.audio('sound_stick', './assets/sounds/stick.wav');
        this.load.audio('sound_jump', './assets/sounds/jump.wav');
        this.load.audio('sound_land', './assets/sounds/land.wav');

        //load images
        this.load.atlas('play', './assets/spritesheet.png', './assets/sprites.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.image('ground', './assets/ground.png');
        this.load.image('collision', './assets/collisionmask.png');
        this.load.plugin('rexrotatetoplugin', './lib/rexrotatetoplugin.min.js' , true); // load plugin for rotate
    }


    create() {
        this.sky = this.add.tileSprite(0,0, config.width, config.height, 'play', 'sky').setOrigin(0.5,0).setScale(2);

        this.p1 = new Player(this, this.matter.world, 562, 400, 'collision'); // do we need setOrigin?
        this.ground = this.matter.add.image(config.width - 700, config.height - 50, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" }).setScale(1, 4);
        this.ground.setInteractive();
        this.platform = this.matter.add.image(-200, 400, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" }).setScale(1, 2);
        this.platform.setInteractive();
        this.platform2 = this.matter.add.image(config.width + 100, 300, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" }).setScale(1, 2);
        this.platform2.setInteractive();
        this.platform3 = this.matter.add.image(config.width/2, 450, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" }).setScale(0.5, 2);
        this.platform3.setInteractive();

        this.ceiling = this.matter.add.image(config.width/2, 150, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" }).setScale(0.4, 2.5);
        this.ceiling.setInteractive();


        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // fix later
        this.matter.add.mouseSpring();
        this.p1.isGrappled = false;
        // this.matter.add.worldConstraint(this.p1, 100, 1, {pointA: {x:320, y:200},});

        this.p1.sprite.rotateTo = this.plugins.get('rexrotatetoplugin').add(this.p1.sprite, { // add rotate to p1
            speed: 500
        });

        
        this.cameras.main.setBounds(0, 0, config.width*2, config.height);        
        this.cameras.main.startFollow(this.p1, false, 0.04, 0);
        this.cameras.main.setBackgroundColor('#000000'); 
       
    }

    update() {
        this.p1.update();   
        this.sky.x = this.p1.x;
        this.sky.tilePositionX = this.p1.x/1.5; 

        // check if dead
        if (this.p1.y >= config.height) { // touching bottom
            this.scene.start('death');
        }
        // touching fire
    }
}