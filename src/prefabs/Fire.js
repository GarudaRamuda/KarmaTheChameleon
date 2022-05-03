class Fire {
    constructor(scene) {
        this.scene = scene;
        this.x = 0;
        this.y = config.height;
        this.velocityX = 1;
        this.distance = 0;
        this.maxDistFromScreen = 250;

        //this.debugLine = scene.add.graphics().setDepth(10);
        //this.debugLine.lineBetween(this.x, config.height, this.x, 0);

        //load fire animation
        this.bodyFire = scene.add.sprite(this.x, this.y,'body_fire').setOrigin(1,1).setScale(2).setDepth(2);
        scene.anims.create({
            key: 'burn!!',
            frames: scene.anims.generateFrameNumbers('body_fire', {start: 0, end: 59, first: 0}),
            frameRate: 60,
            repeat: -1
        });
        this.bodyFire.play('burn!!');

        /*
        this.sideFire = scene.add.sprite(this.x, this.y,'side_fire').setOrigin(0,1).setScale(2);
        scene.anims.create({
            key: 'burn!',
            frames: scene.anims.generateFrameNumbers('side_fire', {start: 0, end: 59, first: 0}),
            frameRate: 60,
            repeat: -1
        });
        this.sideFire.play('burn!');
        */
    }

    update(distance, player, worldView) {
        this.distance = Phaser.Math.Distance.Between(this.x, 0, worldView.left, 0);
        if(this.distance > this.maxDistFromScreen && this.x < worldView.left) this.x = worldView.left - this.maxDistFromScreen;
        console.log(this.distance);
        let futureVel = -(50 / distance)  + player.maxVelocityX;
        this.x += this.velocityX;
        if(distance > 0 && futureVel > 0) this.velocityX = futureVel;
        else this.velocityX = 3;
        //console.log(this.velocityX);
        this.updateSprites();
    }

    updateSprites() {
        //this.debugLine.setPosition(this.x, 0);
        this.bodyFire.setPosition(this.x + 200, this.y);
    }
}