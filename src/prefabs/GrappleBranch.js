class GrappleBranch extends Phaser.Physics.Matter.Image {
    constructor (scene, world, x, y, texture, frame, options) {
        super (world, x, y, texture, frame, options)
        this.scene = scene;
        scene.add.existing(this);
        this.scene = scene;
        this.world = world;
        this.setScale(2);
        this.bodyPadX = -20;
        this.bodyPadY = 38;
        this.displayOriginX = this.width/2 + this.bodyPadX;
        this.displayOriginY = this.height/2 + this.bodyPadY;
        this.body = scene.matter.add.rectangle(x, y, 8, 8, {isSensor: true, isStatic: true, label: 'grapplable'});
        this.body.parent = this;
    }

    destroy() {
        this.world.remove(this.body);
        this.world.remove(this);
    }

    jiggle() {
        this.scene.tweens.add({
            targets: this,
            y: {from: this.y, to: this.y + 10},
            ease: 'Power4',
            duration: 40,
            repeat: 2,
        })
    }

    unJiggle() {
        this.scene.tweens.add({
            targets: this,
            y: {from: this.y, to: this.y - 10},
            ease: 'Power4',
            duration: 40,
            repeat: 2,
        })
    }
}