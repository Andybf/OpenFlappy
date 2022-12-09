import Target from './target.js';
import Player from './player.js';

export default class Control {

    canvas;
    player;

    targets = {
        'wall' : new Array(),
        'barriers' : new Array()
    }
    audioSystem;
    isGameOver = false;
    isSimulationRunning = false;
    points = 0;
    airResistance = 0.0025;
    barrierQuantity = 4;

    oneSecond = 1000;
    tickInterval = 60;
    startTime;
    passedTime;
    gravity = -9.81/this.tickInterval;

    constructor(canvas) {
        this.canvas = canvas;
        this.audioSystem = new Audio();
        this.audioSystem.loop = false;
        this.audioSystem.volume = 0.5;

        window.addEventListener('keyup', (event) => {
            if(event.key == 'r' && this.isGameOver == true) {
                this.resetGame();
            }
        });

        window.addEventListener('click', (event) => {
            if (this.isGameOver == false) {
                this.player.setForce(0);
                this.player.flapWings();
                this.audioSystem.src = '/content/sound/flap.mp3';
                this.audioSystem.play();
            }
        });

        this.initialize();
    }

    initialize() {
        this.startTime = Date.now();
        this.passedTime =0;

        this.player = new Player(4,1.001, 1,1);

        let BarrierDistance = 10;
        let barrierStep = 5;

        this.targets['wall'].push(new Target(0,0, 10,1));

        for(let x=0; x<this.barrierQuantity/2; x++) {
            let barrierUp = new Target( BarrierDistance+(barrierStep*x), 0,  1.5, 0);
            barrierUp.generateSize();
            barrierUp.rotation = 180;
            this.targets['barriers'].push(barrierUp);

            let barrierDown = new Target( BarrierDistance+(barrierStep*x), 10,  1.5, 0);
            barrierDown.generateSize();
            this.targets['barriers'].push(barrierDown);
        }
        setTimeout( () => {
            if (this.isSimulationRunning) {
                this.isSimulationRunning = false;
            } else {
                this.mainLoop();
                this.isSimulationRunning = true;
            }
        },1000);
    }

    mainLoop() {
        this.interval = setInterval(() => {
            this.detectCollisions();
            this.calcMovements();
            this.calcGamePoints();

            if (!this.isSimulationRunning) {clearInterval(this.interval); return;};

            this.canvas.clearCanvas();
            this.targets['barriers'].forEach( (element) => {
                this.canvas.draw(element);
                element.addForce((0.00001));
            });
            this.canvas.draw(this.player);
            this.canvas.print('Points: '+ this.points, 0);

            //this.passedTime = new Date(Date.now() - this.startTime).getTime()/1000;
        },
        this.oneSecond / this.tickInterval);
    }

    detectCollisions() {
        if ((this.hasCollide(this.player, this.targets['wall']) || this.hasCollide(this.player, this.targets['barriers'])) &&
            this.isGameOver == false)
        {
            this.playerHit();
        }
        else if (this.hasCollide(this.player, this.targets['wall']) && this.isGameOver) {
            this.gameOver();
        }
        else {
            if (this.player.movement.force > this.gravity) {
                this.player.addForce( - this.airResistance);
            }
        }
    }

    calcMovements() {
        this.player.calcPlayerAnimation();
        this.targets['barriers'].forEach( (barrier) => {
            barrier.calcMovement();
        });
    }

    calcGamePoints() {
        for (let c=0; c<this.targets['barriers'].length; c+=2) {
            if (Math.floor(this.player.position.x) == Math.ceil(this.targets['barriers'][c].position.x) &&
                this.targets['barriers'][c].pointsToCollect > 0
            ) {
                this.points += this.targets['barriers'][c].pointsToCollect;
                this.targets['barriers'][c].pointsToCollect = 0;

                this.audioSystem.src = '/content/sound/point.mp3';
                this.audioSystem.play();
            }
        }
    }

    playerHit() {
        this.targets['barriers'].forEach( barrier => { barrier.setForce(0); });
        this.player.rotationFactor = 300;
        this.audioSystem.src = '/content/sound/hit.mp3';
        this.audioSystem.play();
        this.isGameOver = true;
    }

    gameOver() {
        this.isSimulationRunning = false;
        this.canvas.print('Game Over!', 1);
        this.canvas.print('Press R to reset', 2);
    }

    resetGame() {
        this.points = 0;
        this.player = null;
        this.isGameOver = false;
        this.targets['wall'].pop()
        this.targets['barriers'].length = 0;
        this.initialize();
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