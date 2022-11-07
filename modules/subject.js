export default class Subject {

    directionUp = 'up';
    directionDown = 'down';
    directionLeft = 'left';
    directionRight = 'right';

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

    constructor(posX, posY, sizX, sizY) {
        this.position.x = posX;
        this.position.y = posY;
        this.size.x = sizX;
        this.size.y = sizY;
    }

    setForce(forcePoint) {
        this.movement.force = forcePoint;
    }

    addForce(forcePoints) {
        this.movement.force += forcePoints;
    }

    get posDownSide() {
        return Number(this.position.y.toFixed(6))-this.size.y;
    }

    get posRightSide() {
        return Number(this.position.x.toFixed(6))+this.size.x;
    }

    get posLeftSide () {
        return Number(this.position.x.toFixed(6));
    }
}