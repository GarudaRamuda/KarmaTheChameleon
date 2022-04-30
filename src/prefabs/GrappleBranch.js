class GrappleBranch extends Phaser.Physics.Matter.Image {
    constructor (scene, world, x, y, texture, frame, options) {
        super (world, x, y, texture, frame, options)
        scene.add.existing(this);
        this.scene = scene;
        this.world = world;
        this.setScale(2);
        this.bodyPadX = -20;
        this.bodyPadY = 38;
        this.displayOriginX = this.width/2 + this.bodyPadX;
        this.displayOriginY = this.height/2 + this.bodyPadY;
        this.body = scene.matter.add.rectangle(x, y, 8, 8, {isSensor: true, isStatic: true, label: 'grapplable'});
    }

    destroy() {
        this.world.remove(this.body);
        this.world.remove(this);
    }
}