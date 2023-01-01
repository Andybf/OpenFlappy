import Cloud from '/OpenFlappy/source/subjects/cloud.js';
import Ground from '/OpenFlappy/source/subjects/ground.js';
import Pipe from '/OpenFlappy/source/subjects/pipe.js';
import Player from '/OpenFlappy/source/subjects/player.js';
import JglAudio from '/OpenFlappy/source/JglAudio.js';
import ScoreSystem from '/OpenFlappy/source/score.js';

const GAME_TEXTURE_PATH = '/OpenFlappy/content/image/sprites.png';
const GAME_SOUND_POINT_PATH = '/OpenFlappy/content/sound/point.mp3';
const GAME_SOUND_FLAP_PATH = '/OpenFlappy/content/sound/flap.mp3';
const GAME_SOUND_HIT_PATH = '/OpenFlappy/content/sound/hit.mp3';

export default class Control {

    canvas;
    player;
    clouds = new Array();

    minSize = 4.20;
    maxSize = 9.10;

    grounds = new Array();
    pipes = new Array();
    audioSystem;
    isGameOver = false;
    isSimulationRunning = false;
    airResistance = 0.0040;
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
        this.scoreSystem = new ScoreSystem();

        window.addEventListener('keyup', (event) => {
            if(event.key == 'r' && this.isGameOver == true) {
                this.resetGame();
            }
            if (event.key == 'q') {
                this.playerHit();
                this.gameOver();
            }
            if (event.key == 'd') {
                IS_DEBUG = IS_DEBUG ? false : true;
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
        this.clouds[0].position.x = randBetween(1,8,1);

        this.player = new Player(4, 6, 1, 0.766);
        
        for(let c=0; c<this.canvas.widthPoints+3; c+=3) {
            let newGround = new Ground(c,1, 3,1);
            newGround.setForce(this.gameSpeed);
            this.grounds.push(newGround);
        }

        this.canvas.clearCanvas();
        this.clouds.forEach( cloud => {
            this.canvas.draw(cloud);
        });
        this.grounds.forEach( ground => {
            this.canvas.draw(ground);
        });
        this.canvas.draw(this.player);
        this.canvas.print('Click/tap to start!', 1);
    }

    startGameplay() {
        this.isSimulationRunning = true;
        this.pushNewPipes(10);
        this.pushNewPipes(15);
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
            this.pipes.forEach( (pipe) => {
                this.canvas.draw(pipe.upper);
                this.canvas.draw(pipe.bottom);
            });
            this.grounds.forEach( ground => {
                this.canvas.draw(ground);
            });
            this.canvas.draw(this.player);
            this.canvas.print('Points: '+ this.scoreSystem.score, 0);
        },
        this.oneSecond / this.tickInterval);
    }

    detectCollisions() {
        if ((this.player.hasCollideWith(this.grounds) ||
            this.player.hasCollideWith(Object.values(this.pipes[0])) ||
            this.player.hasCollideWith(Object.values(this.pipes[1]))) &&
            this.isGameOver == false)
        {
            this.playerHit();
        }
        else if (this.player.hasCollideWith(this.grounds) && this.isGameOver) {
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
        this.grounds.forEach( ground => {
            ground.calcMovement();
        });
        this.pipes.forEach( (barrier, index) => {
            barrier.upper.calcMovement();
            barrier.bottom.calcMovement();
            if(barrier.upper.shouldBeDeletedFromMemory) {
                this.pipes.splice(index,1);
                this.pushNewPipes(10);
            }
        });
    }

    calcGamePoints() {
        this.pipes.forEach( pipePair => {
            if (Math.ceil(pipePair.upper.posX) < Math.floor(this.player.position.x) &&
                pipePair.upper.pointsToCollect > 0
            ) {
                this.scoreSystem.addPoints(pipePair.upper.pointsToCollect);
                pipePair.upper.pointsToCollect = 0;
                this.audioSystem.game.makePoint.play();
            }
        });
    }

    playerHit() {
        this.pipes.forEach( pipe => {
            pipe.upper.setForce(0);
            pipe.bottom.setForce(0);
        });
        this.grounds.forEach( ground => { ground.setForce(0); });
        this.clouds.forEach( cloud => { cloud.setForce(0); });
        this.player.rotationFactor *= 3;
        this.audioSystem.player.hit.play();
        this.isGameOver = true;
    }

    gameOver() {
        this.isSimulationRunning = false;
        this.scoreSystem.countPlayerRecord();
        this.canvas.print('Game Over!', 1);
        this.canvas.print('Your record: '+this.scoreSystem.playerRecord, 2);
        this.canvas.print('Click to reset', 3);
    }

    resetGame() {
        this.scoreSystem.reset();
        this.player = null;
        this.isGameOver = false;
        this.grounds.length = 0;
        this.pipes.length = 0;
        this.clouds.length = 0;
        this.initialize();
    }

    pushNewClouds(quantity) {
        for(let x=0; x<quantity; x++) {
            let rect = {
                x: randBetween(11,18,1),
                y: randBetween(5,10,1),
                w: 0,
                h: 0
            }
            let overallSize = rect.y/2;
            rect.w = randBetween(overallSize, overallSize, 1);
            rect.h = randBetween(overallSize/1.5, overallSize/3, 1)
            let newCloud = new Cloud(rect.x, rect.y, rect.w, rect.h);
            newCloud.setForce(randBetween(this.gameSpeed, this.gameSpeed+0.0150, 4));
            this.clouds.push(newCloud);
        }
    }

    pushNewPipes(initialPosX) {
        const openingPosY = randBetween(this.minSize, this.maxSize, 2);
        const openingSize = 2.75/2;
        const pipeDownPosY = 12;
        const pipeUpPosY = 18;
        const pipeSizeX = 1.33
        const pipeSizeY = 6;

        let pipeDown = new Pipe(initialPosX, pipeDownPosY-openingSize-openingPosY, pipeSizeX, pipeSizeY);
        pipeDown.setForce(this.gameSpeed);

        let pipeUp = new Pipe(initialPosX, pipeUpPosY+openingSize-openingPosY, pipeSizeX, pipeSizeY);
        pipeUp.setForce(this.gameSpeed);
        pipeUp.rotation = 180;

        this.pipes.push( {upper : pipeUp, bottom : pipeDown} );
    }
}