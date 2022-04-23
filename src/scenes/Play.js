class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        // Sounds
        this.load.audio('music', './assets/Song.wav');
        this.load.image('ground', './assets/ground.png');
        this.load.image('chameleon', './assets/chameleon.png');
    }


    create() {
        // Create and play music
        this.music = this.sound.add('music');
        this.music.play();

        this.matter.world.setBounds();
        this.ground = this.matter.add.image(400, 400, 'ground', null, { restitution: 0.4, isStatic: true });
        this.p1 = new Player(this, this.matter.world, 220, 180, 'chameleon'); // do we need setOrigin?

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // fix later
        this.matter.add.mouseSpring();
    }

    update() {
        this.p1.update();
    }
}