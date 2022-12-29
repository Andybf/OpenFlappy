import Subject from "./subject.js";

export default class Pipe extends Subject {

    originalPosition;
    minSize = 2.20;
    maxSize = 2.90;
    pointsToCollect = 1;
    barrierSpeed = 0.0500;

    constructor(posX, posY, sizX, sizY) {
        super(posX, posY, sizX, sizY);
        this.sprites.rects = [
            { x : 0, y : 92, h : 192, w : 96 }
        ]
        this.setForce(this.barrierSpeed);
    }

    calcMovement() {
        this.position.x -= Number(this.movement.force.toFixed(3));
        if (this.posRightX < 0) {
            this.resetPosition();
            this.generateHeightPosition();
        }
    }

    resetPosition() {
        this.position.x = 10;
        this.pointsToCollect = 1;
    }

    generateHeightPosition() {
        const newSize = Number((Math.random() * (this.maxSize - this.minSize + 1) + this.minSize).toFixed(3));
        this.size.y = newSize;
        if (this.position.y < 10) {
            this.position.y = newSize;
        }
    }
}