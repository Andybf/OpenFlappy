import Subject from "./subject.js";

export default class Player extends Subject {

    flapForce = 0.100;
    rotationFactor = 150;

    constructor(posX, posY, sizX, sizY) {
        super(posX, posY, sizX, sizY);
        this.shadowSize = 10;
        this.sprites.rects = [
            { x : 0, y : 0, h : 92, w : 120 },
            { x : 120, y : 0, h : 92, w : 120 },
            { x : 240, y : 0, h : 92, w : 120 },
            { x : 360, y : 0, h : 92, w : 120 }
        ];
        this.hitbox = {
            x : 0.10,  y : -0.10,
            w : -0.20, h : 0.20
        };
        this.generateVariant();
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
        this.position.y += Number(this.movement.force.toFixed(3));
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

    generateVariant() {
        this.sprites.variantIndex = randBetween(0, 1, 0);
        if (this.sprites.variantIndex == 0) {
            this.sprites.variantIndex = 0;
        } else {
            this.sprites.variantIndex = 2;
        }
    }
}