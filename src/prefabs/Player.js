class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, world, x, y, texture, frame, options) {
        super (world, 0, 0, texture, frame, options);
        scene.add.existing(this);
        this.groundForce = 0.075;
        this.groundSpeedCap = 0.4;
        this.airSpeed = 1.2;
        this.isGrounded = false;
        this.jumpHeight = 8;

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        const { width: w, height: h } = this;


        const mainBody = Bodies.rectangle(0, 0, w * 0.6, h * 0.4, { chamfer: { radius: 10 } });
        let sensor = Bodies.rectangle(0, h * 0.2, w * 0.25, 2, { isSensor: true });
        const compoundBody = Body.create({
            parts: [mainBody, sensor],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.3,
            mass: 4,
            render: { sprite: { xOffset: 0.5, yOffset: 0.5} },
        })

        // Resize the player collision. Set origin later.
        this.setExistingBody(compoundBody)

        // Keep player collision from rotating
        this.setFixedRotation();
        this.setPosition(x, y);
    }

    update() {
        const velocity = this.body.velocity;
        if(keyA.isDown) {
            this.applyForce({x: -this.groundForce, y: 0}); // move negative x-axis
            if (velocity.x < -this.groundSpeedCap) this.setVelocityX(-this.groundSpeedCap);
        }
        if(keyD.isDown) {
            this.applyForce({x: this.groundForce, y: 0}); // move positive x-axis
            if (velocity.x > this.groundSpeedCap) this.setVelocityX(this.groundSpeedCap);
        }
        if(keySPACE.isDown) {
            this.setVelocityY(-this.jumpHeight); // move up y-axis
        }
    }
}