class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    create() {
        this.matterTimeStep = 16.66;
        this.accumulator = 0;
        this.matter.world.autoUpdate = false;
        this.matter.set60Hz();
        this.bg_far = this.add.tileSprite(0,0, 528, 288, 'img_bg_far').setOrigin(0,0).setScale(2);
        this.bg_mid2 = this.add.tileSprite(0,0, 528, 288, 'img_bg_mid2').setOrigin(0,0).setScale(2);
        this.bg_mid = this.add.tileSprite(0,0, 528, 288, 'img_bg_mid').setOrigin(0,0).setScale(2);
        this.bg_close = this.add.tileSprite(0,0, 528, 288, 'img_bg_close').setOrigin(0,0).setScale(2);
        this.tongueImg = this.add.image(50, 50, 'spr_tongue');
        this.tongue = new Tongue(this, 'spr_tongue');

        this.p1 = new Player(this, this.matter.world, 100, config.height/2, 'collision'); // do we need setOrigin?

        //declare looping objects in array
        let branch1 = new GrappleBranch(this, this.matter.world, this.p1.x + 200, 100, 'grappleBranch', null, {isStatic: true, isSensor: true,});
        let branch2 = new GrappleBranch(this, this.matter.world, this.p1.x + 200 + 426, 100, 'grappleBranch', null, {isStatic: true, isSensor: true,});
        let branch3 = new GrappleBranch(this, this.matter.world, this.p1.x + 200 + 426*2, 100, 'grappleBranch', null, {isStatic: true, isSensor: true,});
        this.startingPlatform = this.matter.add.image(100, config.height, 'ground', null, { restitution: 0, isStatic: true, label: "grapplable" }).setScale(1, 4);
        this.objectArray = [
            branch1,
            branch2,
            branch3,
        ];

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // fix later
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.p1.sprite.rotateTo = this.plugins.get('rexrotatetoplugin').add(this.p1.sprite, { // add rotate to p1
            speed: 500
        });

        this.cameras.main.startFollow(this.p1, false, 0.04, 0);
        this.cameras.main.setBackgroundColor('#abefbd');
        this.cameras.main.followOffset.x = -300; 
        this.p1.y = this.startingPlatform.y - this.startingPlatform.height/2;
       
        let scoreConfig = {
            fontFamily: 'stockyPixels',
            fontSize: '16px',
            color: '#f5ffe8',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        // create scoreboard
        let scorePad = 20;
        this.distance = 0;
        this.offsetx = 125;
        this.scoreBox = this.add.image(100, scorePad, 'button').setOrigin(0.5, 0.5).setScale(4, 2);   
        this.score = this.add.text(100, this.scoreBox.y + 2, 'DISTANCE ' + this.distance, scoreConfig).setOrigin(0.5);
    }


    update(time, delta) {   
        this.accumulator += delta;
        while (this.accumulator >= this.matterTimeStep) {
            this.accumulator -= this.matterTimeStep;
            this.p1.update();
            this.tongue.track(this.p1);

            // scoreboard
            this.updateScore();

            // check if dead
            if (this.p1.y >= config.height) { // touching bottom
                this.scene.start('death', {score: this.distance});
            }
            // touching fire

            //check if platforms are outside the screen and handle the behavior for that
            this.loopingObjectHandler();
            this.parallaxBGs();
            this.matter.world.step(this.matterTimeStep)
        }
    }

    updateScore() {
        this.scoreBox.x = this.cameras.main.worldView.left + this.offsetx;
        this.score.x = this.cameras.main.worldView.left + this.offsetx;
        this.distance = (this.p1.x - 100) / 64 ;
        this.score.setText('DISTANCE ' + this.distance.toFixed(2));
    }

    // Loops through array of objects that must be culled when oustisde left side of screen
    // Can handle each object in a variety of ways, but will just bring it back to the beginning for the time being
    loopingObjectHandler() {
        let camera = this.cameras.main;
        let worldView = camera.worldView;
        for(let i = 0; i < this.objectArray.length; i++) {
            let object = this.objectArray[i];

            if(!this.isOffLeft(camera, object)) continue;

            object.x = worldView.right + object.width;
        }
    }


    // Checks to see if given object is outside view of camera in worldview
    // pre: objects origin must be in the very middle of the object
    // post: returns true if object is outside camera view to the left, false otherwise
    isOffLeft(camera, object) {
        let worldView = camera.worldView;
        let objectRight = object.x + object.width;
        return objectRight < worldView.left;  
    }

    // Not really a function, but is used to parralax fixed bg's a certain amount
    parallaxBGs() {
        
        this.parallaxAmount(this.bg_far);
        this.parallaxAmount(this.bg_mid2, 3.3);
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