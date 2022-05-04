class Fire {
    constructor(scene) {
        this.scene = scene;
        this.x = -1000;
        this.y = config.height;
        this.velocityX = 1;
        this.distance = 0;
        this.maxDistFromScreen = 500;

        this.soundFireClose = scene.sound.add('sound_fire_close', {loop:true});
        this.soundFireMed = scene.sound.add('sound_fire_med', {loop:true});
        this.soundFireFar = scene.sound.add('sound_fire_far', {loop:true});

        this.soundFireClose.play();
        this.soundFireMed.play();
        this.soundFireFar.play();
        
        this.fire_aura = scene.add.image(this.x, this.y, 'img_fire_aura').setOrigin(0.5,1).setScale(2).setDepth(3);
        this.fire_aura.setBlendMode(Phaser.BlendModes.COLOR);

        //load fire animation
        this.bodyFire = scene.add.sprite(this.x, this.y + 6,'body_fire').setOrigin(1,1).setScale(2).setDepth(2);
        scene.anims.create({
            key: 'burn!!',
            frames: scene.anims.generateFrameNumbers('body_fire', {start: 0, end: 59, first: 0}),
            frameRate: 60,
            repeat: -1
        });
        this.bodyFire.play('burn!!');
    }

    update(distance, player, worldView) {
        this.distance = Phaser.Math.Distance.Between(this.x, 0, worldView.left, 0);
        if(this.distance > this.maxDistFromScreen && this.x < worldView.left) this.x = worldView.left - this.maxDistFromScreen;
        //console.log(this.distance);
        let futureVel = -(50 / distance)  + 6;
        this.x += this.velocityX;
        if(distance > 0 && futureVel > 0) (this.velocityX = futureVel);
        else this.velocityX = 1;
        //console.log(this.velocityX);
        this.updateSprites();
        this.setVolume(this.soundFireClose, 100, 0, worldView);
        this.setVolume(this.soundFireMed, 500, 250, worldView);
    }

    updateSprites() {
        //this.debugLine.setPosition(this.x, 0);
        this.bodyFire.setPosition(this.x + 200, this.y+ 6);
        this.fire_aura.setPosition(this.x + 100, this.y);
    }

    clamp(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }

    setVolume(song, fadeOut, fadeIn, worldView) {
        let volume = 0;
        if(this.x < worldView.left) volume = this.clamp((fadeOut - this.distance) / (fadeOut - fadeIn), 0, 1);
        else volume = 1;
        //console.log(`${song.key}: Volume: ${volume}`)
        song.setVolume(volume);
    }

    endSound() {
        this.volumeFade(this.soundFireClose);
        this.volumeFade(this.soundFireMed);
        this.volumeFade(this.soundFireFar);
    }

    volumeFade(song, time = 1){
        song.setVolume(song.volume - (1/(60*time)));
        if(song.volume <= 0 ) song.stop();
        //console.log(`${song.volume}`)
    }
}