class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    create() {
        this.matterTimeStep = 1000/60;
        this.accumulator = 0;
        this.matter.world.autoUpdate = false;
        this.matter.set60Hz();
        this.bg_far = this.add.tileSprite(0,0, 528, 288, 'img_bg_far').setOrigin(0,0).setScale(2);
        this.bg_mid2 = this.add.tileSprite(0,0, 528, 288, 'img_bg_mid2').setOrigin(0,0).setScale(2);
        this.bg_mid = this.add.tileSprite(0,0, 528, 288, 'img_bg_mid').setOrigin(0,0).setScale(2);
        this.bg_trees = this.add.tileSprite(0,0, 528, 288, 'img_bg_trees').setOrigin(0,0).setScale(2);
        this.bg_close = this.add.tileSprite(0,0, 528, 288, 'img_bg_close').setOrigin(0,0).setScale(2);
        this.tongueImg = this.add.image(50, 50, 'spr_tongue');
        this.tongue = new Tongue(this, 'spr_tongue');
        this.spawnGap = 6;
        this.hasSpawned = false;
        this.dead = false;
        
        this.birdSounds = this.sound.add('sound_birds', {loop: true});
        this.birdSounds.play();

        this.jungleSound = this.sound.add('sound_jungle', {loop: true});
        this.jungleSound.play();

        this.introSong = this.sound.add('song_intro');
        this.loopSong = this.sound.add('song_loop', {loop: true});

        this.introSong.play();
        this.introSong.once('complete', () => {if(!this.dead) this.loopSong.play();});

        this.p1 = new Player(this, this.matter.world, 100, config.height/2, 'collision'); // do we need setOrigin?


        // declare different object types
        // branch_sm has +100 for x-coordinate so it spawns in offscreen
        this.objectProtos = [            
            {spawn: (x, y) => this.objectArray.push(this.matter.add.image(this.cameras.main.worldView.right + 150 + x, config.height + 50 + y, 'branch_sm', null, {restitution: 0, isStatic: true,}).setScale(2).setOrigin(0.5, 0.58).setFlipX(true))},            
            {spawn: (x, y) => this.objectArray.push(new GrappleBranch(this, this.matter.world, this.cameras.main.worldView.right + x + 20, 100 + y, 'grappleBranch', null, {isStatic: true, isSensor: true,}))},
        ];

        //declare starting objects in array
        let branch1 = new GrappleBranch(this, this.matter.world, 500, 100, 'grappleBranch', null, {isStatic: true, isSensor: true,});
        let branch_lg = this.matter.add.image(100, config.height, 'branch_lg', null, { restitution: 0, isStatic: true,}).setScale(2).setOrigin(0.5, 0.58);
        let branch_sm = this.matter.add.image(900, config.height + 50, 'branch_sm', null, {restitution: 0, isStatic: true,}).setScale(2).setOrigin(0.5, 0.58).setFlipX(true);
        this.objectArray = [
            branch1,
            branch_sm,
            branch_lg,
        ];

        this.keyGuide = this.add.image(this.p1.x, this.p1.y - 6, 'keys', null).setScale(2).setOrigin(0.5).setAlpha(0);
        this.tweens.add({
            targets: this.keyGuide,
            alpha: {value: 1, duration: 1000, ease: 'Power4'},
            duration: 1500,
            ease: 'Power4',
            repeat: 0,
            delay: 500,
            yoyo: true,
            hold: 1300,
        })
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
        this.p1.y = branch_lg.y - branch_lg.height/2;
       
        let scoreConfig = {
            fontFamily: 'stockyPixels',
            fontSize: '16px',
            color: '#f5ffe8',
            align: 'right',
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
        this.score = this.add.text(100, scorePad + 2, 'DISTANCE ' + this.distance, scoreConfig).setOrigin(0, 0.5);

        // track x-cord of object and distance scaling
        this.objCoordTracker = 10;
        this.scale_dist = 0;
      
        this.Fire = new Fire(this);
    }


    update(time, delta) {   
        this.accumulator += delta;
        while (this.accumulator >= this.matterTimeStep) {
            if(this.dead) {
                this.volumeFade(this.loopSong);
                this.volumeFade(this.birdSounds);
                this.volumeFade(this.jungleSound);
                this.Fire.endSound();
            }
            this.accumulator -= this.matterTimeStep;
            this.p1.update();
            this.p1.maxVelocityX = Math.floor(this.distance/100) + 4
            //console.log(`Max speed: ${this.p1.maxVelocityX}`);
            this.keyGuide.x = this.p1.x;
            this.keyGuide.y += (this.p1.body.position.y - this.p1.body.positionPrev.y);
            this.tongue.track(this.p1);

            // scoreboard
            this.updateScore();

            // check if dead
            if ((this.p1.y >= config.height + 40 || this.p1.x <= this.Fire.x) && !this.dead) { // touching bottom
                this.dead = true;
                setTimeout(() => {
                    this.sound.stopAll();
                    this.scene.start('death', {score: this.distance});
                }, 1500);
            }
            // touching fire

            //check if platforms are outside the screen and handle the behavior for that
            this.destroyOffScreen();
            this.parallaxBGs();
            
            this.okToSpawn();

            this.spawnController();
            this.Fire.update(this.distance, this.p1 ,this.cameras.main.worldView);

            this.matter.world.step(this.matterTimeStep);
        }
    }

    // control spawning objects
    spawnController() {
        if (Math.floor(this.distance % this.spawnGap) != 5) {
            this.hasSpawned = false;
            return null;
        }
        //console.log(`${this.hasSpawned}`)

        if(!this.hasSpawned && this.okToSpawn()) {
            this.hasSpawned = true;
            // console.log("Spawning");
            this.spawnNewObject();
        }
    }

    // check if ready to spawn
    okToSpawn() {        
        if ((this.distance - this.objCoordTracker) > this.scale_dist) {
            // console.log("True");
            return true;
        }
        return false;
    }


    // scale distance
    // 7+ creates gaps you cant jump across
    scaleDifficulty(x) {
        if (x < 10) {
            return 1;
        }
        else if (x < 100) {
            return 2;
        }
        else if (x < 250) {
            return 3;
        }
        else if (x < 350) {
            return 4;
        }
        else if (x < 450) {
            return 5;
        }
        else if (x < 500) {
            return 6;
        }
        return 0;
    }

    // randomize Y height of objects
    changeObjectHeight() {
        return Math.floor(Math.random() * 25);
    }

    spawnNewObject() {
        // let selection = Math.floor(this.getRandomArbitrary(0, this.objectProtos.length));        
        let selection = this.rand75(); // 75% chance of spawning branch
        // console.log("S: ", selection);
        this.scale_dist = this.scaleDifficulty(this.distance);
        // console.log(this.distance + this.scale_dist);
        this.objCoordTracker = this.distance;
        this.objectProtos[selection].spawn(this.scale_dist, this.changeObjectHeight());
    }

    // rand50() and rand75() copied from: geeksforgeeks.org
    // https://www.geeksforgeeks.org/generate-0-1-25-75-probability/
    rand50() {
        return Math.floor(Math.random() * 10) & 1;
    }
     
    rand75() {
        return this.rand50() | this.rand50();
    }
     

    // Code copied from developer.mozilla.org
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    // getRandomArbitrary(min, max) {
    //     return Math.random() * (max - min) + min;
    // }

    // update scoreboard
    updateScore() {
        this.score.x = this.cameras.main.worldView.left + this.offsetx - 108;
        this.distance = (this.p1.x - 100) / 64 ;
        this.score.setText('DISTANCE ' + this.distance.toFixed(2));
    }

    // Loops through array of objects that must be culled when oustisde left side of screen
    // Can handle each object in a variety of ways, but will just bring it back to the beginning for the time being
    destroyOffScreen() {
        let camera = this.cameras.main;
        let worldView = camera.worldView;
        for(let i = 0; i < this.objectArray.length; i++) {
            let object = this.objectArray[i];

            if(!this.isOffLeft(camera, object)) continue;
            object.destroy();
            this.objectArray.splice(i);
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
        this.parallaxAmount(this.bg_mid2, 4);
        this.parallaxAmount(this.bg_mid, 2.4);
        this.parallaxAmount(this.bg_trees, 2.2);
        this.parallaxAmount(this.bg_close, 2.1);
    }

    // Function that takes a tilesprite and has it parallax based off of a given amount
    // Not entirely sure how the offset amount works, but setting it to 2 seems to lock it to the camera
    // 0-2 offset is foreground 2 is playspace 2->inf is background
    parallaxAmount(tileSprite, offsetAmount = 0) {
        // lock tilesprite to camera
        let worldView = this.cameras.main.worldView;
        tileSprite.x = worldView.x;

        //Create parralax amount
        if(offsetAmount == 0) return null;
        tileSprite.tilePositionX = worldView.x/offsetAmount;
    }

    volumeFade(song, time = 1){
        song.setVolume(song.volume - (1/(60*time)));
        if(song.volume <= 0 ) song.stop();
        //console.log(`${song.volume}`)
    }
}