import Subject from "./subject.js";

export default class Player extends Subject {

    flapForce = 0.0825;
    rotationFactor = 100;

    constructor(posX, posY, sizX, sizY) {
        super(posX, posY, sizX, sizY);
        this.sprites.texture.src = '/content/image/sprites.png';
        this.sprites.width = 32;
        this.sprites.height = 32;
    }

    calcPlayerAnimation() {
        this.calcPosition();
        this.calcRotation();
        this.calcTexture();
    }

    calcRotation() {
        this.rotation = this.movement.force * this.rotationFactor;
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

    flapWings() {
        this.addForce(this.flapForce);
    }

}