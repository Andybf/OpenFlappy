import Cloud from '/OpenFlappy/source/subjects/cloud.js';
import Ground from '/OpenFlappy/source/subjects/ground.js';
import Pipe from '/OpenFlappy/source/subjects/pipe.js';
import Player from '/OpenFlappy/source/subjects/player.js';
import JglAudio from '/OpenFlappy/source/JglAudio.js';

const GAME_TEXTURE_PATH = '/OpenFlappy/content/image/sprites.png';
const GAME_SOUND_POINT_PATH = '/OpenFlappy/content/sound/point.mp3';
const GAME_SOUND_FLAP_PATH = '/OpenFlappy/content/sound/flap.mp3';
const GAME_SOUND_HIT_PATH = '/OpenFlappy/content/sound/hit.mp3';

export default class Control {

    canvas;
    player;
    clouds = new Array();

    targets = {
        'wall' : new Array(),
        'barriers' : new Array()
    }
    audioSystem;
    isGameOver = false;
    isSimulationRunning = false;
    points = 0;
    airResistance = 0.0035;
    barrierQuantity = 4;

    gameSpeed = 0.0500;

    oneSecond = 1000;
    tickInterval = 60;
    gravity = -9.81/this.tickInterval;

    constructor(canvas) {
        this.canvas = canvas;

        this.audioSystem = {
            game : {
                makePoint : new JglAudio(GAME_SOUND_POINT_PATH)
            },
            player : {
                flap : new JglAudio(GAME_SOUND_FLAP_PATH),
                hit  : new JglAudio(GAME_SOUND_HIT_PATH),
            },
        }

        window.addEventListener('keyup', (event) => {
            if(event.key == 'r' && this.isGameOver == true) {
                this.resetGame();
            }
            if (event.key == 'p') {
                this.playerHit();
                this.gameOver();
            }
        });

        window.addEventListener('click', (event) => {
            if (this.isGameOver == false && this.isSimulationRunning) {
                this.player.setForce(0);
                this.player.flapWings();
                this.audioSystem.player.flap.play();
            }
            else if (this.isGameOver == false && this.isSimulationRunning == false) {
                this.startGameplay();
            }
            else if (this.isGameOver && this.isSimulationRunning == false) {
                this.resetGame();
            }
        });

        let gameTexture = new Image();
        gameTexture.src = GAME_TEXTURE_PATH;
        this.canvas.loadTexture(gameTexture);
        gameTexture.onload = () => {
            this.initialize();
        };
    }

    initialize() {
        this.pushNewClouds(3);
        this.clouds[0].position.x = randBeteewen(1,8,1);

        this.player = new Player(4, 6, 1, 0.766);
        
        for(let c=0; c<this.canvas.widthPoints+3; c+=3) {
            let newGround = new Ground(c,1, 3,1);
            newGround.setForce(this.gameSpeed);
            this.targets['wall'].push(newGround);
        }

        this.canvas.clearCanvas();
        this.clouds.forEach( cloud => {
            this.canvas.draw(cloud);
        });
        this.targets['wall'].forEach( ground => {
            this.canvas.draw(ground);
        });
        this.canvas.draw(this.player);
        this.canvas.print('Points: '+ this.points, 0);
        this.canvas.print('Click to start!', 1);
    }

    startGameplay() {
        this.isSimulationRunning = true;

        let pipeDistance = 10;
        let pipeStep = 5;

        for(let x=0; x<this.barrierQuantity/2; x++) {
            let pipeUp = new Pipe(pipeDistance+(pipeStep*x), 0, 1.33, 0);
            pipeUp.generateHeightPosition();
            pipeUp.setForce(this.gameSpeed);
            this.targets['barriers'].push(pipeUp);

            let pipeDown = new Pipe(pipeDistance+(pipeStep*x), 10, 1.33, 0);
            pipeDown.generateHeightPosition();
            pipeDown.setForce(this.gameSpeed);
            pipeDown.rotation = 180;
            this.targets['barriers'].push(pipeDown);
        }
        this.mainLoop();
    }

    mainLoop() {
        this.interval = setInterval(() => {
            this.detectCollisions();
            this.calcMovements();
            this.calcGamePoints();

            if (!this.isSimulationRunning) {
                clearInterval(this.interval);
                return;
            };

            this.canvas.clearCanvas();
            this.clouds.forEach( cloud => {
                this.canvas.draw(cloud);
            });
            this.targets['barriers'].forEach( (pipe) => {
                this.canvas.draw(pipe);
            });
            this.targets['wall'].forEach( ground => {
                this.canvas.draw(ground);
            });
            this.canvas.draw(this.player);
            this.canvas.print('Points: '+ this.points, 0);
        },
        this.oneSecond / this.tickInterval);
    }

    detectCollisions() {
        if ((this.player.hasCollideWith(this.targets['wall']) || this.player.hasCollideWith(this.targets['barriers'])) &&
            this.isGameOver == false)
        {
            this.playerHit();
        }
        else if (this.player.hasCollideWith(this.targets['wall']) && this.isGameOver) {
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
        this.clouds.forEach( (cloud,index) => {
            cloud.calcMovement();
            if (cloud.shouldBeDeletedFromMemory) {
                this.clouds.splice(index,1);
                this.pushNewClouds(1);
            }
        });
        this.targets['wall'].forEach( ground => {
            ground.calcMovement();
        });
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
                this.audioSystem.game.makePoint.play();
            }
        }
    }

    playerHit() {
        this.targets['barriers'].forEach( barrier => { barrier.setForce(0); });
        this.targets['wall'].forEach( ground => { ground.setForce(0); });
        this.clouds.forEach( cloud => { cloud.setForce(0); });
        this.player.rotationFactor *= 3;
        this.audioSystem.player.hit.play();
        this.isGameOver = true;
    }

    gameOver() {
        this.isSimulationRunning = false;
        this.canvas.print('Game Over!', 1);
        this.canvas.print('Click to reset', 2);
    }

    resetGame() {
        this.points = 0;
        this.player = null;
        this.isGameOver = false;
        this.targets['wall'].length = 0;
        this.targets['barriers'].length = 0;
        this.clouds.length = 0;
        this.initialize();
    }

    pushNewClouds(quantity) {
        for(let x=0; x<quantity; x++) {
            let rect = {
                x: randBeteewen(11,18,1),
                y: randBeteewen(5,10,1),
                w: 0,
                h: 0
            }
            let overallSize = rect.y/2;
            rect.w = randBeteewen(overallSize, overallSize, 1);
            rect.h = randBeteewen(overallSize/1.5, overallSize/3, 1)
            let newCloud = new Cloud(rect.x, rect.y, rect.w, rect.h);
            newCloud.setForce(randBeteewen(this.gameSpeed, this.gameSpeed+0.0150, 4));
            this.clouds.push(newCloud);
        }
    }
}