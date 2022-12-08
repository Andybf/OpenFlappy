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
    points = 0;
    gravity = -9.81/this.tickInterval;
    flapforce = 0.0825;
    airResistance = 0.0025;
    barrierQuantity = 4;

    constructor(canvas) {
        this.canvas = canvas;

        let BarrierDistance = 10;
        let barrierStep = 5;
        for(let x=0; x<this.barrierQuantity/2; x++) {

            let barrierUp = new Target( BarrierDistance+(barrierStep*x), 0,  1.5, 0);
            barrierUp.generateSize();
            barrierUp.rotation = 180;
            this.targets['barriers'].push(barrierUp);

            let barrierDown = new Target( BarrierDistance+(barrierStep*x), 10,  1.5, 0);
            barrierDown.generateSize();
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
            this.calcPoints();

            if (!this.isSimulationRunning) {clearInterval(this.interval); return;};

            this.canvas.clearCanvas();
            this.canvas.draw(this.subject);
            this.targets['barriers'].forEach( (element) => {
                this.canvas.draw(element);
            });
            this.canvas.print('Points: '+this.points, 0);
        },
        this.oneSecond / this.tickInterval);
    }

    calcPoints() {
        for (let c=0; c<this.targets['barriers'].length; c++) {
            if (Math.floor(this.subject.position.x) == Math.ceil(this.targets['barriers'][c].position.x)) {
                this.points += this.targets['barriers'][c].pointsToCollect;
                this.targets['barriers'][c].pointsToCollect = 0;
            }
        }
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
            this.canvas.print('Game Over!', 1);
            this.isSimulationRunning = false;
        } else {
            if (this.subject.movement.force > this.gravity) {
                this.subject.addForce( - this.airResistance);
            }
        }
    }

    hasCollide(subject, targets) {
        for (let c=0; c<targets.length; c++) {
            if (
                (subject.posX >= targets[c].posX && subject.posX <= targets[c].PosRightX &&
                 subject.posY <= targets[c].posY && subject.posY >= targets[c].posDownY)
                 ||
                (subject.posRightX >= targets[c].posX && subject.posRightX <= targets[c].posRightX &&
                 subject.posY <= targets[c].posY && subject.posY >= targets[c].posDownY)
                 ||
                (subject.posRightX >= targets[c].posX && subject.posRightX <= targets[c].posRightX &&
                 subject.posDownY <= targets[c].posY && subject.posDownY >= targets[c].posDownY)
                 ||
                (subject.posX >= targets[c].posX && subject.posX <= targets[c].posRightX &&
                 subject.posDownY <= targets[c].posY && subject.posDownY >= targets[c].posDownY)
            ) {
                return true;
            }
        };
        return false;
    }
}