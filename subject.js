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
        x : 4,
        y : 1.001
    };

    size = {
        x : 1,
        y : 1
    }

    color = "#343434";

    setForce(forcePoint) {
        this.movement.force = forcePoint;
    }

    addForce(forcePoints) {
        this.movement.force += forcePoints;
    }

    get posDownY() {
        return Number(this.position.y.toFixed(6))-this.size.y;
    }
}