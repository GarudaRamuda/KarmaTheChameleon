class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, world, x, y, texture, frame, options) {
        super (world, x, y, texture, frame, options);
        scene.add.existing(this);
        this.moveSpeed = 1.8;
        this.airSpeed = 1.2;
        this.setBody({
                type: 'rectangle',
            height: 32,
            width: 40,
        });

        // Keep player collision from rotating
        this.setFixedRotation();
    }
}