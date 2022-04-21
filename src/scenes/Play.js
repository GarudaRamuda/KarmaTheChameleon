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
        this.p1 = new Player(this, this.matter.world, 220, 180, 'chameleon'); // do we need setOrigin?
        this.p1Temp = this.matter.add.sprite(200, 200, 'chameleon');

    }

    update() {

    }
}