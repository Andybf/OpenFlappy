import Subject from "./subject.js";

export default class Ground extends Subject {

    resetPositionX = 0;

    constructor(posX, posY, sizX, sizY, resetX) {
        super(posX, posY, sizX, sizY);
        this.resetPositionX = resetX;
        this.sprites.rects = [
            { x : 120, y : 212, h : 44, w : 120 }
        ];
        this.hitbox.y = -0.25;
        this.hitbox.h = -0.25;
    }

    calcMovement() {
        this.position.x -= Number(this.movement.force.toFixed(3));
        if (this.posRightX <= 0) {
            this.resetPosition();
        }
    }

    resetPosition() {
        this.position.x = this.resetPositionX;
    }
}