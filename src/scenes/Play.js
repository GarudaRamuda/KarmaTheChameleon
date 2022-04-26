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
        this.load.image('ground', './assets/ground.png');
        this.load.image('chameleon', './assets/chameleon.png');
        this.load.image('chameleonGrappled', './assets/chameleonGrappled2.png');
        this.load.image('radius', './assets/radius.png');
        this.load.image('seg', './assets/seg.png');
        this.load.image('sky', './assets/sky.png');
        this.load.plugin('rexrotatetoplugin', './lib/rexrotatetoplugin.min.js' , true); // load plugin for rotate
    }


    create() {
        this.sky = this.add.tileSprite(0,0, config.width, config.height, 'sky').setOrigin(0,0);

        this.matter.world.setBounds();

        this.p1 = new Player(this, this.matter.world, 30, 20, 'chameleon'); // do we need setOrigin?
        this.ground = this.matter.add.image(config.width/2, config.height - 50, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" }).setScale(2, 4);
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

        this.p1.rotateTo = this.plugins.get('rexrotatetoplugin').add(this.p1, { // add rotate to p1
            speed: 500
        });
    }

    update() {
        this.p1.update();
    }
}