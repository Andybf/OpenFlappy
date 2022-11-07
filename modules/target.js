import Subject from "./subject.js";

export default class Target extends Subject {

    constructor(posX, posY, sizX, sizY) {
        super(posX, posY, sizX, sizY);
    }

    calcMovement() {
        this.position.x -= Number(this.movement.force.toFixed(6));
        if (this.posRightSide < 0) {
            this.position.x = 10;
        }
    }
}