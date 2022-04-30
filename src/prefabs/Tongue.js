class Tongue {
    constructor(scene, texture) {
        this.scene = scene;
        this.sizeX = 100;
        this.sizeY = 8;
        this.sprite = scene.add.image(10, 10, texture, null).setScale(this.sizeX, this.sizeY).setOrigin(0, 0.5);
        this.attatched = false;
        this.sprite.setVisible(false);
    }

    track(player) {
        this.sprite.setPosition(player.x, player.y);
    }

    attatchTo(point) {
        let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, point);
        let distance = Phaser.Math.Distance.BetweenPoints(this.sprite, point);
        this.sprite.setRotation(angle);
        this.sprite.setScale(distance, this.sizeY);
    }

    setVisibility(visibility) {
        this.sprite.setVisible(visibility);
    }

    visible() {
        return this.sprite.visible;
    }
};