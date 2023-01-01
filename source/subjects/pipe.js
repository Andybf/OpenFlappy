import Subject from "./subject.js";

export default class Pipe extends Subject {

    pointsToCollect = 1;
    shouldBeDeletedFromMemory = false;

    constructor(posX, posY, sizX, sizY) {
        super(posX, posY, sizX, sizY);
        this.sprites.rects = [
            { x : 0, y : 92, h : 304, w : 96 }
        ];
        this.hitbox.x = +0.075;
        this.hitbox.w = -0.150;
    }

    calcMovement() {
        this.position.x -= Number(this.movement.force.toFixed(3));
        if (this.posRightX < 0) {
            this.shouldBeDeletedFromMemory = true;
        }
    }
}