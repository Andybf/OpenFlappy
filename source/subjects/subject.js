/*
 * Subject.js
 * Created by: Anderson Bucchianico
 * 
 * Additional Help:
 * 
 * How hitbox works:
 * By default, the hitbox has the same position and dimensions as the draw rect.
 * The values of the hitbox rect exist to expand and/or shrink the hitbox,
 * relative to the draw rect dimensions. Consider the following configuration:
 * 
 * hitBox = {
 *     x : 0, y : 10,
 *     w : -5, h : 0
 * }
 * ┌──-────────────────-┐
 * │                    │  Legend:
 * ├- - - - - - - - -┐  │  ─────  =  Object draw rectangle
 * │                 |  │  - - -  =  Object hitbox
 * │                 |  │
 * │                 |  │
 * └─────────────────┴─-┘
 * 
 */

export default class Subject {

    sprites = {
        variantIndex : 0,
        activeIndex : 0,
        rects : []
    }

    movement = {
        force : 0.125
    }

    position = {
        x : 0,
        y : 1
    };

    size = {
        x : 1,
        y : 1
    }

    hitbox = {
        x : 0, y : 0,
        w : 0, h : 0
    }

    color = "#343434";
    rotation = 0.0;
    alpha = 1;

    constructor(posX, posY, sizX, sizY) {
        this.position.x = posX;
        this.position.y = posY;
        this.size.x = sizX;
        this.size.y = sizY;
    }

    setForce(forcePoint) {
        this.movement.force = Number(forcePoint.toFixed(3));
    }

    addForce(forcePoints) {
        this.movement.force = Number((this.movement.force+forcePoints).toFixed(3));
    }

    hasCollideWith(targets) {
        for (let c=0; c<targets.length; c++) {
            if (
                (this.hitboxPosX >= targets[c].hitboxPosX && this.hitboxPosX <= targets[c].hitboxPosRightX &&
                 this.hitboxPosY <= targets[c].hitboxPosY && this.hitboxPosY >= targets[c].hitboxPosDownY)
                 ||
                (this.hitboxPosRightX >= targets[c].hitboxPosX && this.hitboxPosRightX <= targets[c].hitboxPosRightX &&
                 this.hitboxPosY <= targets[c].hitboxPosY && this.hitboxPosY >= targets[c].hitboxPosDownY)
                 ||
                (this.hitboxPosRightX >= targets[c].hitboxPosX && this.hitboxPosRightX <= targets[c].hitboxPosRightX &&
                 this.hitboxPosDownY <= targets[c].hitboxPosY && this.hitboxPosDownY >= targets[c].hitboxPosDownY)
                 ||
                (this.hitboxPosX >= targets[c].hitboxPosX && this.hitboxPosX <= targets[c].hitboxPosRightX &&
                 this.hitboxPosDownY <= targets[c].hitboxPosY && this.hitboxPosDownY >= targets[c].hitboxPosDownY)
            ) {
                return true;
            }
        };
        return false;
    }

    get posRightX() {
        return Number(this.position.x.toFixed(3))+this.size.x;
    }
    get posDownY() {
        return Number(this.position.y.toFixed(3))-this.size.y;
    }
    get posX() {
        return Number(this.position.x.toFixed(3));
    }
    get posY() {
        return Number(this.position.y.toFixed(3));
    }

    get hitboxPosRightX() {
        return (Number(this.position.x.toFixed(3))+this.size.x) + this.hitbox.w;
    }
    get hitboxPosDownY() {
        return (Number(this.position.y.toFixed(3))-this.size.y) + this.hitbox.h;
    }
    get hitboxPosX() {
        return Number(this.position.x.toFixed(3)) + this.hitbox.x;
    }
    get hitboxPosY() {
        return Number(this.position.y.toFixed(3)) + this.hitbox.y;
    }
}