class Tongue {
    constructor(scene, texture) {
        this.scene = scene;
        this.sizeX = 100;
        this.sizeY = 8;
        this.sprite = scene.add.image(10, 10, texture, null).setScale(this.sizeX, this.sizeY).setOrigin(0, 0.5);
        this.attatched = false;
    }
    
    track(player) {
        this.sprite.setPosition(player.x, player.y);
    }

    attatchTo(point) {
        let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, point);
        console.log(angle);
        this.sprite.setRotation(angle);
    }
};