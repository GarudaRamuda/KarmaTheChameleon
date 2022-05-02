// Initial body and sprite setup adapted from code by Michael Hadley
// https://medium.com/itnext/modular-game-worlds-in-phaser-3-tilemaps-5-matter-physics-platformer-d14d1f614557

// TODO: Fix the math in onSensorCollide() so that the player's collision is nudged slightly out of range when its left/right sensors collide with something.
// Probably need to tweak the initialization of L/R sensors in create() as well.
class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, world, x, y, texture, frame, options) {
        super (world, 0, 0, texture, frame, options);
        scene.add.existing(this);
        // global
        this.scene = scene;
        
        // hide collision
        this.visible = false;

        // actual displayed sprite
        this.sprite = scene.add.sprite(0, 0, 'play', 'chameleonWalk_01').setScale(2);
        // render the player on top
        this.sprite.depth = 1;

        // sprite animations
        this.sprite.anims.create({
            key: 'walk', 
            frames: this.sprite.anims.generateFrameNames('play', {
                start: 1, end: 2, zeroPad: 2,
                prefix: 'chameleonWalk_',
                }), 
            duration: 500,
            delayRepeat: 500,
            repeat: -1
        });

        this.sprite.anims.create({
            key: 'idle', 
            frames: this.sprite.anims.generateFrameNames('play', {
                start: 1, end: 1, zeroPad: 2,
                prefix: 'chameleonWalk_',
            }),
        });

        this.sprite.anims.create({
            key: 'grapple',
            frames: this.sprite.anims.generateFrameNames('play', {
                start:1, end: 1, zeroPad: 2,
                prefix: 'chameleonGrapple_'
            })
        });


        // Set up player movement params
        this.groundForce = 0.045;
        this.groundSpeedCap = 0.4; // velocity is hard capped whenever player is grounded

        this.grappleForce = .0007;
        this.grapplePush = 0.003;

        this.jumpHeight = 11;
        
        //Apex Floating Variables
        this.maxUpwardForce = 0.006;
        this.startingVelocity = 1;
        this.terminatingVelocity = 3;

        // Value to apply additional force to player after releasing grapple
        this.yBoost = 0.07;
        this.grappleReleaseForce = 0.03;
        this.canBoost = false;

        this.maxVelocityX = 5;
        this.dragForce = 0.003;

        // Track when sensors are touching something
        this.isTouching = {bottom: false};

        // Collision mask for grapplable objects in range of player
        this.grappleRect = scene.matter.add.image(0, 0, 'grappleMask', null, { isSensor: true, ignoreGravity: true,});
        this.grappleRect.setAlpha(0);
        this.grappleRect.setIgnoreGravity(true);
        this.isGrappled = false;
        this.outOfGrapple = false;

        // list of grapplable things in player's range
        this.grappleTargets = [];
        // arrays to manage bodies and constraints in a grapple
        this.grappleArray = null;
        this.bodyArray = null;
        // Whenever player is grounded, set lastGrounded to coyoteTime; ticks down every frame, set to 0 by jumping, and jumping is disabled at 0
        this.coyoteTime = 15;
        this.lastGrounded = 0;

        this.ropeJustCreated = false;
        this.ropeCreatedFrameAgo = false;

        // Let player jump even if they press too early before landing
        this.bufferWindow = 16;
        this.jumpBuffer = 0;

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        const { width: w, height: h } = this;

        // Set up the compound body's parts
        const mainBody = Bodies.rectangle(0, 0, w * 0.6, h * 0.4, { chamfer: { radius: 10 } });

        // Create sensors for left, right, bottom
        // (x, y, w, h, options)
        this.sensors = {
            bottom: Bodies.rectangle(0, h * 0.25, w * 0.15, 2, { isSensor: true }),
        };
    
        // Assemble the compound body and physics properties
        const compoundBody = Body.create({
            parts: [mainBody, this.sensors.bottom],
            frictionStatic: 0,
            frictionAir: 0,
            friction: 0.3,
            mass: 4,
            gravityScale: {x: 0.75, y: 0.75},
            render: { sprite: { xOffset: 0.5, yOffset: 0.5} },
            ignorePointer: true,
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

        // keep grapple point for rotation
        this.grapplePointX;
        this.grapplePointY;
        this.backflip;

        
    }

    update() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        // bind the grapple range; it may flip to the wrong position while grappled, but this doesn't matter in gameplay
        this.grappleRect.x = (this.sprite.flipX ? this.x - this.grappleRect.width/2:this.x + this.grappleRect.width/2);
        this.grappleRect.y = this.y - this.grappleRect.height/2;

        if (!keySPACE.isDown && this.isGrappled) {
            this.ungrapple();
            this.scene.tongue.detach();
        }

        if(this.ropeCreatedFrameAgo) {
            // Use this line as a break point to see the rope segments the frame after their creation
            this.ropeCreatedFrameAgo = false;
        }

        if(this.ropeJustCreated) {
            this.ropeJustCreated = false;
            this.ropeCreatedFrameAgo = true;
        }

        // Rotate
        let isMovingLeft = (this.scene.p1.body.velocity.x < 0 ? true : false);
        
        if (this.isGrappled) {
            this.sprite.rotateTo.rotateTowardsPosition(this.grapplePointX, this.grapplePointY, 0);
            this.scene.tongue.attatchTo({x: this.grapplePointX, y: this.grapplePointY});                        
        } else {
            // rotate back to normal
            if (isMovingLeft) {
                this.sprite.flipX = true;
                this.sprite.rotateTo.rotateTowardsPosition(this.sprite.x, this.sprite.y, 1);          
            } else {
                this.sprite.rotateTo.rotateTowardsPosition(this.sprite.x+1, this.sprite.y, this.backflip);                     
            }
        }

        if (this.jumpBuffer > 0) this.jumpBuffer -= 1;

        if (this.isGrappled) {
            this.rotateAroundPoint();
        }
        
        const velocity = this.body.velocity;
        if (this.isTouching.bottom) {
            if(this.lastGrounded != this.coyoteTime) {
                this.scene.sound.play('sound_land');
            } 
            this.outOfGrapple = false;
            this.lastGrounded = this.coyoteTime;
        }
        else {
            this.lastGrounded -= 1;
        }

        // Controls Air gravity adjustment
        let canAirGravity = this.body.velocity.y > -this.startingVelocity && this.body.velocity.y < this.terminatingVelocity && !this.scene.p1.isGrappled;
        if(canAirGravity) {
            this.applyForce({x:0, y:-this.maxUpwardForce});
        }

        // Post Grapple Boost
        if(this.canBoost) {
            let dir = Math.atan2(this.body.velocity.y, this.body.velocity.x);
            let boostForceY =  (Math.sin(dir) * this.grappleReleaseForce) - this.yBoost;
            let boostForceX =  Math.cos(dir) * this.grappleReleaseForce;
            this.applyForce({x: boostForceX, y: boostForceY});
            this.canBoost = false;
        }

        /* BEGIN INPUT HANDLING */
        if(keyA.isDown) {
            if (!this.sprite.flipX) this.sprite.flipX = true;
            if (!this.isGrappled && this.lastGrounded == this.coyoteTime) this.sprite.anims.play('walk', true);
            else if (!this.isGrappled) this.sprite.anims.play('idle', true);
            if (this.isGrappled) { 
                this.applyForce({x: -this.grappleForce, y:0});
            }
            else if (!this.outOfGrapple || (this.outOfGrapple && velocity.x > -this.groundSpeedCap)) {
                this.applyForce({x: -this.groundForce, y: 0}); // move negative x-axis
            }
            if (!this.isGrappled && !this.outOfGrapple) {
                if (velocity.x < -this.groundSpeedCap) this.setVelocityX(-this.groundSpeedCap);
            }
        }
        if(keyD.isDown) {
            if (this.sprite.flipX) this.sprite.flipX = false;
            if (!this.isGrappled && this.lastGrounded == this.coyoteTime) this.sprite.anims.play('walk', true);
            else if (!this.isGrappled) this.sprite.anims.play('idle', true);
            // Apply smaller force on a grapple
            if (this.isGrappled){
                this.applyForce({x: this.grappleForce, y:0});
            }
            else if (!this.outOfGrapple || (this.outOfGrapple && velocity.x < this.groundSpeedCap)) {
                this.applyForce({x: this.groundForce, y: 0}); // move positive x-axis
            }
            // Cap speed when not grappling
            if (!this.isGrappled && !this.outOfGrapple) {
                if (velocity.x > this.groundSpeedCap) this.setVelocityX(this.groundSpeedCap);
            }
        }

        if (!keyA.isDown && !keyD.isDown && !this.isGrappled) this.sprite.anims.play('idle', true);
        if(Phaser.Input.Keyboard.JustDown(keySPACE) || this.jumpBuffer > 0) {
            //console.log(`Space pressed`)
           // console.log(`Jump buffer: ${this.jumpBuffer}, Last grounded: ${this.lastGrounded}`)
            if (this.lastGrounded > 0) {
                //console.log(`Jumping`)
                this.setVelocityY(-this.jumpHeight); // move up y-axis
                this.lastGrounded = 0;
                this.scene.sound.play('sound_jump');
                this.groundSoundPlayed = false;
            }
            else if (this.lastGrounded < 0) {
                //console.log(`Grappling`)
                this.grapple();
            }
            else if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                //console.log(`Jump Buffer`)
                this.jumpBuffer = this.bufferWindow;
            } 
        }

        /* END INPUT HANDLING */
        if (this.isGrappled) this.sprite.flipX = false;
        this.dragHandler();
    }

    dragHandler() {
        if(this.body.velocity.x < this.maxVelocityX || this.isGrappled) return null;
        let drag = this.dragForce;
        //console.log(`velocity: ${this.body.velocity.x}, drag: ${drag}`);
        this.applyForce({x:-drag, y: 0});
    }

    rotateAroundPoint() {
        // psuedocode
        // find angle and radius away from grapple point
        // Rotate counter clockwise around circle until player ungrapples
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

                if (bodyA.isSensor && bodyA.label != 'grapplable')
                {
                    otherBody = bodyB;
                    playerBody = bodyA;
                }
                else if (bodyB.isSensor)
                {
                    otherBody = bodyA;
                    playerBody = bodyB;
                }

                if (playerBody === this.sensors.bottom && !otherBody.isSensor) {
                    this.isTouching.bottom = true;
                }
                // voodoo logic because this.grappleRect does not reference the actual body that was created for it
                else if (playerBody === this.grappleRect.body) {
                    if (otherBody.label == 'grapplable') {
                        this.grappleTargets.push(otherBody);
                    }
                }
            }
        }
    }

    grapple() {
        if (!this.isGrappled) {
            for (let i = 0; i < this.grappleTargets.length; i++) {
                // Check that the clicked body is considered grapplable
                if (this.grappleTargets[i] != null && this.grappleTargets[i].label == 'grapplable') {
                    let body = this.grappleTargets[i];
                    // Divide ropeLength by a number greater than 1 to give the player some leeway if they grapple from the ground
                    let ropeLength = Phaser.Math.Distance.BetweenPoints(body.position, this);

                    // adjust ropeStep to create more rope segments
                    let num_steps = 3;
                    let ropeStep = ropeLength / num_steps;

                    let prev;

                    //used to debug rope
                    this.ropeJustCreated = true;

                    // save grapple point
                    this.grapplePointX = body.position.x;
                    this.grapplePointY = body.position.y;
                    
                    // set backflip
                    this.backflip = Math.floor(Math.random() * 3);

                    // Create a line to find the points along it for spawning bodies
                    let line = new Phaser.Geom.Line(body.position.x, body.position.y, this.x, this.y);
                    let points = line.getPoints(num_steps, ropeStep);
                    let stiffness = 0.4;
                    let damping = 0.8;
                    this.grappleArray = [];
                    this.bodyArray = [];
                    // Generate an array of segments to form our rope
                    for (let i = 0; i < Math.floor(ropeLength / ropeStep) - 1; i++) {

                        let seg = this.scene.matter.add.image(points[i].x, points[i].y, 'play', 'seg', {shape: 'circle', mass:0.1}).setScale(2).setVisible(false);

                        this.bodyArray.push(seg);

                        // First segment binds to a point in the world
                        if (i == 0) {
                            // worldConstraint(body, length, stiffness, {options})
                            this.grappleArray.push(this.scene.matter.add.worldConstraint(seg, ropeStep, stiffness, {damping: damping, pointA: {x: body.position.x, y: body.position.y}}))
                        }
                        // Otherwise attach to the previous segment
                        else
                        {
                            // joint(bodyA, bodyB, length, stiffness, {options})
                            this.grappleArray.push(this.scene.matter.add.joint(prev, seg, ropeStep, stiffness, {damping: damping}));
                        }
                        prev = seg;

                        // Attach the player to the very last segment the loop makes
                        if (i == Math.floor(ropeLength / ropeStep) - 2) {
                            this.grappleArray.push(this.scene.matter.add.joint(prev, this, ropeStep, stiffness, {damping: damping}));
                        }
                    }
                    this.scene.sound.play('sound_stick');
                    this.isGrappled = true;

                    this.sprite.anims.play('grapple', true);
                    break;
                    this.setVelocityX(0);
                    this.setVelocityY(0);
                }
            }
        }
    }

    ungrapple() {
        if (this.isGrappled) {
            this.scene.matter.world.removeConstraint(this.grappleArray);
            this.scene.matter.world.remove(this.bodyArray);
            this.isGrappled = false;
            this.sprite.anims.play('idle', true);
            this.canBoost = true;
            this.outOfGrapple = true;
        }
    }
    resetTouching() {
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.bottom = false;
        this.grappleTargets = [];
    }
}
