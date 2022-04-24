class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        this.load.image('ground', './assets/ground.png');
        this.load.image('chameleon', './assets/chameleon.png');
        this.load.image('radius', './assets/radius.png');
    }


    create() {
        this.matter.world.setBounds();

        this.p1 = new Player(this, this.matter.world, 220, 300, 'chameleon'); // do we need setOrigin?
        this.ground = this.matter.add.image(320, 400, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" });
        this.ground.setInteractive();
        this.ceiling = this.matter.add.image(320, 200, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" });
        this.ceiling.setInteractive();


        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // fix later
        this.matter.add.mouseSpring();
        this.p1.isGrappled = false;
        // this.matter.add.worldConstraint(this.p1, 100, 1, {pointA: {x:320, y:200},});
    }

    update() {
        this.p1.update();
    }
}