class Tongue {
    constructor(scene, texture) {
        this.scene = scene;
        this.sizeX = 10;
        this.sizeY = 20;
        this.sprite = scene.add.image(10, 10, texture, null).setScale(this.sizeX, this.sizeY);
    }
};