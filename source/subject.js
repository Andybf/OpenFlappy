export default class Subject {

    directionUp = 'up';
    directionDown = 'down';
    directionLeft = 'left';
    directionRight = 'right';

    sprites = {
        activeIndex : 0,
        width : 0,
        height : 0,
        texture : new Image() 
    }

    movement = {
        force : 0.125,
        momentum : 0,
        direction : this.directionUp
    }

    position = {
        x : 0,
        y : 1
    };

    size = {
        x : 1,
        y : 1
    }

    color = "#343434";
    rotation = 0.0;

    constructor(posX, posY, sizX, sizY) {
        this.position.x = posX;
        this.position.y = posY;
        this.size.x = sizX;
        this.size.y = sizY;
    }

    setForce(forcePoint) {
        this.movement.force = Number(forcePoint.toFixed(6));
    }

    addForce(forcePoints) {
        this.movement.force = Number((this.movement.force+forcePoints).toFixed(6));
    }

    get posDownY() {
        return Number(this.position.y.toFixed(6))-this.size.y;
    }

    get posY() {
        return Number(this.position.y.toFixed(6));
    }

    get posRightX() {
        return Number(this.position.x.toFixed(6))+this.size.x;
    }

    get posX() {
        return Number(this.position.x.toFixed(6));
    }
}