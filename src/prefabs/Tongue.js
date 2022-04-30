class Tongue {
    constructor(scene, texture) {
        this.scene = scene;
        this.animStarted = false;
        this.animPlaying = false;
        this.animDone = false;
        this.sizeX = 1;
        this.sizeY = 8;
        this.distance = 0;
        this.sprite = scene.add.image(10, 10, texture, null).setScale(this.sizeX, this.sizeY).setOrigin(0, 0.5);
        this.sprite.setVisible(false);
    }

    track(player) {
        this.sprite.setPosition(player.x, player.y);
    }

    launch() {
        this.setVisibility(true);
        this.animStarted = true;
        if(!this.attatched) this.tongue_tween = this.scene.tweens.add ({
            targets: this.sprite,
            scaleX: {
                from: 0, 
                to: {value: () => {return this.distance}},
            },
            ease: 'Quad.easeIn',
            duration: 200,
            repeat: 0,
            onStart: () => {this.animPlaying = true;},
            onComplete: () => {
                this.animDone = true;
            },
        });
    }

    attatchTo(point) {
        let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, point);
        this.distance = Phaser.Math.Distance.BetweenPoints(this.sprite, point);
        this.sprite.setRotation(angle);
        if(!this.animStarted) this.launch();
        if(this.animDone) {
            this.sprite.setScale(this.distance, this.sizeY);
        }
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