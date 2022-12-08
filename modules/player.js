import Subject from "./subject.js";

export default class Player extends Subject {

    constructor(posX, posY, sizX, sizY) {
        super(posX, posY, sizX, sizY);
        this.sprites.texture.src = '../media/image/sprites.png';
        this.sprites.width = 32;
        this.sprites.height = 32;
    }

    calcPlayerAnimation() {
        this.calcPosition();
        this.calcRotation();
        this.calcTexture();
    }

    calcRotation() {
        const rotationFactor = 100;
        this.rotation = this.movement.force * rotationFactor;
    }

    calcPosition() {
        this.position.y += Number(this.movement.force.toFixed(6));
    }

    calcTexture() {
        if (this.movement.force < 0) {
            this.sprites.activeIndex = 1;
        } else {
            this.sprites.activeIndex = 0;
        }
    }

}