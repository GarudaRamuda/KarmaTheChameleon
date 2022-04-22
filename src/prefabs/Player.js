// Adapted from code by Michael Hadley
// https://medium.com/itnext/modular-game-worlds-in-phaser-3-tilemaps-5-matter-physics-platformer-d14d1f614557

// TODO: Fix the math in onSensorCollide() so that the player's collision is nudged slightly out of range when its left/right sensors collide with something.
// Probably need to tweak the initialization of L/R sensors in create() as well.
class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, world, x, y, texture, frame, options) {
        super (world, 0, 0, texture, frame, options);
        scene.add.existing(this);

        // Set up player movement params
        this.groundForce = 0.045;
        this.groundSpeedCap = 0.4; // velocity is hard capped whenever player is grounded
        this.airForce = .2;
        this.airSpeedSoftCap = 0.4; // threshold for disabling impulse from movement keys, actual velocity not capped
        this.jumpHeight = 6.25;

        // Track when sensors are touching something
        this.isTouching = {left: false, right: false, bottom: false};
        // Whenever player is grounded, set lastGrounded; ticks down every frame, set to 0 by jumping, and jumping is disabled at 0
        this.coyoteTime = 15;
        this.lastGrounded = this.coyoteTime;

        // Let player jump even if they press too early before landing
        this.bufferWindow = 12;
        this.jumpBuffer = this.bufferWindow;

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        const { width: w, height: h } = this;

        // Set up the compound body's parts
        const mainBody = Bodies.rectangle(0, 0, w * 0.6, h * 0.4, { chamfer: { radius: 10 } });

        // Create sensors for left, right, bottom
        // (x, y, w, h, options)
        this.sensors = {
            bottom: Bodies.rectangle(0, h * 0.25, w * 0.15, 2, { isSensor: true }),
            left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.25, { isSensor: true }),
            right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.25, { isSensor: true })
        };
    
        // Assemble the compound body and properties
        const compoundBody = Body.create({
            parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
            frictionStatic: 0,
            frictionAir: 0,
            friction: 0.3,
            mass: 4,
            render: { sprite: { xOffset: 0.5, yOffset: 0.5} },
        })
        this.setExistingBody(compoundBody)

        // Keep player collision from rotating
        this.setFixedRotation();
        this.setPosition(x, y);

        // Before matter's update, reset our record of what surfaces the player is touching.
        world.on("beforeupdate", this.resetTouching, this);

        // If a sensor just started colliding with something, or it continues to collide with something,
        // call onSensorCollide
        world.on('collisionstart', this.onSensorCollide, this);
        world.on('collisionactive', this.onSensorCollide, this);
    }

    update() {
        if (this.jumpBuffer > 0) this.jumpBuffer -= 1;

        const velocity = this.body.velocity;
        if (this.isTouching.bottom) {
            this.lastGrounded = this.coyoteTime;
        }
        else {
            this.lastGrounded -= 1;
        }
        // let isGrounded = (this.lastGrounded == this.coyoteTime); use this if we need different movement when airborne

        if(keyA.isDown) {
            this.applyForce({x: -this.groundForce, y: 0}); // move negative x-axis
            if (velocity.x < -this.groundSpeedCap) this.setVelocityX(-this.groundSpeedCap);
        }
        if(keyD.isDown) {
            this.applyForce({x: this.groundForce, y: 0}); // move positive x-axis
            if (velocity.x > this.groundSpeedCap) this.setVelocityX(this.groundSpeedCap);
        }
        if(Phaser.Input.Keyboard.JustDown(keyW) || this.jumpBuffer > 0 && this.lastGrounded > 0) {
            this.setVelocityY(-this.jumpHeight); // move up y-axis
            this.lastGrounded = 0;
        }
        else {
            this.jumpBuffer = this.bufferWindow;
        }
        
    }

    onSensorCollide(event) {
        let pairs = event.pairs;

        for (var i = 0; i < pairs.length; i++)
        {
            var bodyA = pairs[i].bodyA;
            var bodyB = pairs[i].bodyB;

            //  We only want sensor collisions
            if (pairs[i].isSensor)
            {
                var otherBody;
                var playerBody;

                if (bodyA.isSensor)
                {
                    otherBody = bodyB;
                    playerBody = bodyA;
                }
                else if (bodyB.isSensor)
                {
                    otherBody = bodyA;
                    playerBody = bodyB;
                }

                if (otherBody.isSensor) return; // don't need collisions with nonphysical objects
                if (playerBody === this.sensors.left) {
                    this.isTouching.left = true;
                    if (pairs.separation > 0.25) this.sprite.x += pairs.separation - 0.25; // nudge the main body away from the wall to avoid friction
                }
                else if (playerBody === this.sensors.right) {
                    this.isTouching.right = true;
                    if (pairs.separation > 0.25) this.sprite.x -= pairs.separation - 0.25;
                }
                else if (playerBody === this.sensors.bottom) {
                    this.isTouching.bottom = true;
                }
            }
        }
    }

    resetTouching() {
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.bottom = false;
    }
}