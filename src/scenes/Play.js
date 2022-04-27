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
        this.loopingArray = [];

        this.p1 = new Player(this, this.matter.world, 562, config.height/2, 'collision'); // do we need setOrigin?
        this.ground1 = this.matter.add.image(config.width - 100, config.height, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" }).setScale(1, 4);
        this.loopingArray.push(this.ground1);
        this.ground2 = this.matter.add.image(100, config.height, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" }).setScale(1, 4);
        this.loopingArray.push(this.ground2);

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // fix later
        this.matter.add.mouseSpring();
        this.p1.isGrappled = false;
        // this.matter.add.worldConstraint(this.p1, 100, 1, {pointA: {x:320, y:200},});

        this.p1.sprite.rotateTo = this.plugins.get('rexrotatetoplugin').add(this.p1.sprite, { // add rotate to p1
            speed: 500
        });

        this.cameras.main.startFollow(this.p1, false, 0.04, 0);
        this.cameras.main.setBackgroundColor('#000000'); 
       
    }

    update() {
        this.p1.update();   
        this.sky.x = this.cameras.main.worldView.x;
        this.sky.tilePositionX = Math.floor(this.cameras.main.worldView.x/2.7); 

        // check if dead
        if (this.p1.y >= config.height) { // touching bottom
            this.scene.start('death');
        }
        // touching fire

        //check if platforms are outside the screen
        this.loopingObjectHandler();
    }

    // Loops through array of objects that must be culled when oustisde left side of screen
    // Can handle each object in a variety of ways, but will just bring it back to the beginning for the time being
    loopingObjectHandler() {
        let camera = this.cameras.main;
        let worldView = camera.worldView;
        for(let i = 0; i < this.loopingArray.length; i++) {
            let object = this.loopingArray[i];

            if(!this.isOffLeft(camera, object)) continue;

            object.x = worldView.right + object.width/2;
        }
    }


    // Checks to see if given object is outside view of camera in worldview
    // pre: objects origin must be in the very middle of the object
    // post: returns true if object is outside camera view to the left, false otherwise
    isOffLeft(camera, object) {
        let worldView = camera.worldView;
        let objectRight = object.x + object.width/2;
        return objectRight < worldView.left;  
    }
}