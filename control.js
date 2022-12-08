import Target from '/modules/target.js';
import Player from '/modules/player.js';

export default class Control {

    canvas;
    subject = new Player(4,1.001, 1,1);

    targets = {
        'wall' : [new Target(0,0, 10,1)],
        'barriers' : new Array()
    }

    isSimulationRunning = false;
    oneSecond = 1000;
    tickInterval = 60;
    gravity = -9.81/this.tickInterval;
    flapforce = 0.0825;
    airResistance = 0.0025;
    barrierSpeed = 0.0250;
    barrierQuantity = 4;

    constructor(canvas) {
        this.canvas = canvas;

        let BarrierDistance = 10;
        let barrierStep = 5;
        for(let x=0; x<this.barrierQuantity/2; x++) {

            let barrierUp = new Target( BarrierDistance+(barrierStep*x), 0,  1, 0);
            barrierUp.generateSize();
            barrierUp.setForce(this.barrierSpeed);
            this.targets['barriers'].push(barrierUp);

            let barrierDown = new Target( BarrierDistance+(barrierStep*x), 10,  1, 0);
            barrierDown.generateSize();
            barrierDown.setForce(this.barrierSpeed);
            this.targets['barriers'].push(barrierDown);
        }

        window.addEventListener('keyup', (event) => {
            this.subject.setForce(0);
            this.subject.addForce(this.flapforce);
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
            this.calcMovements();
            this.canvas.clearCanvas();
            this.canvas.draw(this.subject);
            this.targets['barriers'].forEach( (element) => {
                this.canvas.draw(element);
            });
            
            (!this.isSimulationRunning) && clearInterval(this.interval);
        },
        this.oneSecond / this.tickInterval);
    }

    calcMovements() {
        this.subject.calcPlayerAnimation();
        this.targets['barriers'].forEach( (barrier) => {
            barrier.calcMovement();
        });
    }

    calcCollision() {
        if (this.hasCollide(this.subject, this.targets['wall'])) {
            this.subject.position.y = 1;
        } else if (this.hasCollide(this.subject, this.targets['barriers'])) {
            this.isSimulationRunning = true;
            this.subject.position.y = 1;
        } else {
            if (this.subject.movement.force > this.gravity) {
                this.subject.addForce( - this.airResistance);
            }
        }
    }

    hasCollide(subject, targets) {
        for (let x=0; x<targets.length; x++) {
            if (subject.posRightX >= targets[x].position.x &&
                subject.posRightX <= targets[x].posRightX &&
                subject.posDownY <= targets[x].posY &&
                subject.posDownY >= targets[x].posDownY
            ) {
                return true;
            }
        }
        return false;
    }
}