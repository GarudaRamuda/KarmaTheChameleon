class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        this.load.image('ground', './assets/ground.png');
        this.load.image('chameleon', './assets/chameleon.png');
        this.load.image('chameleonGrappled', './assets/chameleonGrappled.png');
        this.load.image('radius', './assets/radius.png');
        this.load.image('seg', './assets/seg.png');
        this.load.image('sky', './assets/sky.png');
    }


    create() {
        this.sky = this.add.tileSprite(0,0, 640,480, 'sky').setOrigin(0,0);

        this.matter.world.setBounds();

        this.p1 = new Player(this, this.matter.world, 30, 20, 'chameleon'); // do we need setOrigin?
        this.ground = this.matter.add.image(320, 400, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" });
        this.ground.setInteractive();
        this.platform = this.matter.add.image(-200, 200, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" });
        this.platform.setInteractive();
        this.platform2 = this.matter.add.image(config.width + 200, 200, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" });
        this.platform2.setInteractive();
        this.ceiling = this.matter.add.image(config.width/2, 40, 'ground', null, { restitution: 0.4, isStatic: true, label: "grapplable" }).setScale(0.5);
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