import Subject from "./subject.js";

export default class Ground extends Subject {

    barrierSpeed = 0.0500;

    constructor(posX, posY, sizX, sizY) {
        super(posX, posY, sizX, sizY);
        this.sprites.rects = [
            { x : 120, y : 212, h : 44, w : 120 }
        ];
        this.setForce(this.barrierSpeed);
    }

    calcMovement() {
        this.position.x -= Number(this.movement.force.toFixed(6));
        if (this.posRightX < 0) {
            this.resetPosition();
        }
    }

    resetPosition() {
        this.position.x = 10;
    }
}