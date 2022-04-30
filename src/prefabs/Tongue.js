class Tongue {
    constructor(scene, texture) {
        this.scene = scene;
        this.animStarted = false;
        this.animPlaying = false;
        this.animDone = false;
        this.sizeX = 1;
        this.sizeY = 8;
        this.sprite = scene.add.image(10, 10, texture, null).setScale(this.sizeX, this.sizeY).setOrigin(0, 0.5);
        this.sprite.setVisible(false);
    }

    track(player) {
        this.sprite.setPosition(player.x, player.y);
    }

    launch(distance) {
        this.setVisibility(true);
        this.animStarted = true;
        if(!this.attatched) this.scene.tweens.add ({
            targets: this.sprite,
            scaleX: {from: 0, to: distance},
            ease: 'Bounce',
            duration: 100,
            repeat: 0,
            onStart: function () {this.animPlaying = true;},
            onComplete: function () {this.animDone = true;},
        });
    }

    attatchTo(point) {
        let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, point);
        let distance = Phaser.Math.Distance.BetweenPoints(this.sprite, point);
        if(!this.animStarted) this.launch(distance);
        this.sprite.setRotation(angle);
        if(this.animDone) this.sprite.setScale(distance, this.sizeY);
    }

    detach() {
        this.animStarted = false;
        this.animPlaying = false;
        this.animDone = false;
        this.setVisibility(false);
        this.sprite.setScale(1, this.sizeY);
    }

    setVisibility(visibility) {
        this.sprite.setVisible(visibility);
    }

    visible() {
        return this.sprite.visible;
    }
};