import Subject from "./subject.js";

export default class Target extends Subject {

    originalPosition;
    barrierSpeed = 0.0500;
    minSize = 2.0;
    maxSize = 2.75;
    pointsToCollect = 0.5;

    constructor(posX, posY, sizX, sizY) {
        super(posX, posY, sizX, sizY);
        this.sprites.texture.src = '../media/image/pipe.png';
        this.sprites.width = 32;
        this.sprites.height = 64;
        this.setForce(this.barrierSpeed);
    }

    calcMovement() {
        this.position.x -= Number(this.movement.force.toFixed(6));
        if (this.posRightX < 0) {
            this.resetPosition();
            this.generateSize();
        }
    }

    resetPosition() {
        this.position.x = 10;
        this.pointsToCollect = 0.5;
    }

    generateSize() {
        const newSize = Number((Math.random() * (this.maxSize - this.minSize + 1) + this.minSize).toFixed(6));
        this.size.y = newSize;
        if (this.position.y < 10) {
            this.position.y = newSize;
        }
    }
}