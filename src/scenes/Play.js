class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        this.load.image('ground', './assets/ground.png');
        this.load.image('chameleon', './assets/chameleon.png');
    }


    create() {
        this.matter.world.setBounds();
        this.ground = this.matter.add.image(320, 400, 'ground', null, { restitution: 0.4, isStatic: true });
        this.p1 = new Player(this, this.matter.world, 220, 180, 'chameleon'); // do we need setOrigin?

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // fix later
        this.matter.add.mouseSpring();
        this.p1.isGrappled = true;
        this.matter.add.worldConstraint(this.p1, 100, 1, {pointA: {x:320, y:200},});
    }

    update() {
        this.p1.update();
    }
}