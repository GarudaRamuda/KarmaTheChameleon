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

        // background images
        this.load.image('img_bg_close', './assets/back_close.png');
        this.load.image('img_bg_mid', './assets/back_mid.png');
        this.load.image('img_bg_far', './assets/back_far.png');

        this.load.atlas('play', './assets/spritesheet.png', './assets/sprites.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.image('ground', './assets/ground.png');
        this.load.image('collision', './assets/collisionmask.png');
        this.load.plugin('rexrotatetoplugin', './lib/rexrotatetoplugin.min.js' , true); // load plugin for rotate
    }


    create() {
        this.sky = this.add.tileSprite(0,0, config.width, config.height, 'play', 'sky').setOrigin(0.5,0).setScale(2);
        this.bg_far = this.add.tileSprite(0,0, 512, 288, 'img_bg_far').setOrigin(0,0).setScale(2);
        this.bg_mid = this.add.tileSprite(0,0, 512, 288, 'img_bg_mid').setOrigin(0,0).setScale(2);
        this.bg_close = this.add.tileSprite(0,0, 512, 288, 'img_bg_close').setOrigin(0,0).setScale(2);

        this.p1 = new Player(this, this.matter.world, 562, config.height/2, 'collision'); // do we need setOrigin?

        //declare looping objects in array
        this.objectArray = [
            this.matter.add.image(100, config.height, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" }).setScale(1, 4),
            this.matter.add.image(config.width - 100, config.height, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" }).setScale(1, 4),
            this.matter.add.image(config.width - 100, 360, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" }).setScale(1, 1),
        ];


        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // fix later
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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

        //check if platforms are outside the screen and handle the behavior for that
        this.loopingObjectHandler();
        this.parallaxBGs();
    }

    // Loops through array of objects that must be culled when oustisde left side of screen
    // Can handle each object in a variety of ways, but will just bring it back to the beginning for the time being
    loopingObjectHandler() {
        let camera = this.cameras.main;
        let worldView = camera.worldView;
        for(let i = 0; i < this.objectArray.length; i++) {
            let object = this.objectArray[i];

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

    // Not really a function, but is used to parralax fixed bg's a certain amount
    parallaxBGs() {
        
        this.parallaxAmount(this.bg_far);
        this.parallaxAmount(this.bg_mid, 2.7);
        this.parallaxAmount(this.bg_close, 2.3);
    }

    // Function that takes a tilesprite and has it parallax based off of a given amount
    // Not entirely sure how the offset amount works, but setting it to 2 seems to lock it to the camera
    parallaxAmount(tileSprite, offsetAmount = 0) {
        // lock tilesprite to camera
        let worldView = this.cameras.main.worldView;
        tileSprite.x = worldView.x;

        //Create parralax amount
        if(offsetAmount == 0) return null;
        tileSprite.tilePositionX = worldView.x/offsetAmount;
    }
}