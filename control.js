import Subject from '/modules/subject.js';
import Target from '/modules/target.js';

export default class Control {

    canvas;
    subject = new Subject(4,1.001, 1,1);

    targets = {
        'wall' : new Target(0,0, 10,1),
        'barrier' : new Target(9,4, 1,4)
    }

    isSimulationRunning = false;
    oneSecond = 1000;
    tickInterval = 60;
    gravity = 0.0025;

    constructor(canvas) {
        this.canvas = canvas;

        this.targets['barrier'].setForce(0.0250);

        window.addEventListener('keyup', (event) => {
            console.log(event);
            this.subject.setForce(0);
            this.subject.addForce(0.0825);

        });

        window.addEventListener('click', (event) => {
            if (this.isSimulationRunning) {
                this.isSimulationRunning = false;
            } else {
                this.mainLoop();
                this.isSimulationRunning = true;
            }
        });
    }

    mainLoop() {
        this.interval = setInterval(() => {
            this.calcCollision();
            this.calcMovement(this.subject);
            this.canvas.clearCanvas();
            this.canvas.draw(this.subject);
            this.canvas.draw(this.targets['barrier']);
            this.canvas.print(this.subject.position.y.toFixed(6));
            
            (!this.isSimulationRunning) && clearInterval(this.interval);
        },
        this.oneSecond / this.tickInterval);
    }

    calcMovement(subject) {
        subject.position.y += Number(subject.movement.force.toFixed(6));
        this.targets['barrier'].calcMovement();
    }

    calcCollision() {
        if (this.hasCollide(this.subject, this.targets['wall'])) {
            this.subject.setForce(
                Number((this.subject.size.y - this.subject.position.y + this.gravity).toFixed(6))
            );
        } else if (this.hasCollide(this.subject, this.targets['barrier'])) {
            this.isSimulationRunning = true;
        } else {
            this.subject.addForce( - this.gravity);
        }
    }

    hasCollide(subject, target) {
        return subject.posDownSide+this.subject.movement.force < target.position.y &&
               subject.posDownSide < target.position.y &&
               subject.posRightSide > target.position.x
    }
}