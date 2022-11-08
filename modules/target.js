import Subject from "./subject.js";

export default class Target extends Subject {

    originalPosition;

    constructor(posX, posY, sizX, sizY) {
        super(posX, posY, sizX, sizY);
        this.originalPosition = posX;
    }

    calcMovement() {
        this.position.x -= Number(this.movement.force.toFixed(6));
        if (this.posRightX < 0) {
            this.position.x = this.originalPosition;
        }
    }
}