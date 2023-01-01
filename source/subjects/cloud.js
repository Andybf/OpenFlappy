import Subject from "./subject.js";

export default class Cloud extends Subject {

    shouldBeDeletedFromMemory = false;

    constructor(posX, posY, sizX, sizY) {
        super(posX, posY, sizX, sizY);
        this.sprites.rects = [
            { x : 96, y : 286, h : 108, w : 216 },
            { x : 314, y : 286, h : 108, w : 166 }
        ];
        this.sprites.activeIndex = Math.ceil(Math.random()*2) - 1;
        this.alpha = 0.50;
    }

    calcMovement() {
        this.position.x -= Number(this.movement.force.toFixed(3));
        if (this.posRightX < 0) {
            this.shouldBeDeletedFromMemory = true;
        }
    }

}