/*
 * Canvas.js
 * Created by: Anderson Bucchianico
 * 
 *    
 * draw(subject) Help:
 * function drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight):
 * ┌──-────────────────-┐   ┌────------------────┐
 * │       ▲ sy         │   │      ▲ dy          │
 * │       |            │   │      |             │     
 * │sx  ┌──┴───┐        │   │dx  ┌─┴────┐        │     
 * │<---│      │ sHeight│   │<---│      │ dHeight│      
 * │    └──────┘        │   │    └──────┘        │     
 * │     sWidth         │   │     dWidth         │     
 * └───────────────────-┘   └───────────────────-┘     
 *      Source image          Destination canvas 
 * 
 * visit:
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
 * for more information.
 * 
 */

export default class Canvas extends HTMLElement {

    maxHeight = new Number();
    
    screenRatio;
    widthPoints;
    heightPoints;

    loadedTexture;
    globalBackgroundColor;
    context;
    canvas;

    printFontSize = 22;

    constructor() {
        super();
        this.innerHTML = '<canvas></canvas>';
        this.globalBackgroundColor = '#a8defa';
        this.canvas = this.querySelector('canvas');
        this.widthPoints = 10;
        this.heightPoints = 10;
        this.adjustToScreen();
    }

    connectedCallback() {
        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;
        this.context.shadowColor = "black";
        this.clearCanvas();
    }

    adjustToScreen() {
        this.screenRatio = window.innerHeight/window.innerWidth;
        if (this.screenRatio < 1) {
            this.canvas.height = window.innerHeight;
            this.canvas.width = window.innerHeight;
            this.widthPoints = 10;
            this.heightPoints = 10;
        } else {
            this.canvas.height = window.innerHeight;
            this.canvas.width = window.innerWidth;
            this.widthPoints = this.widthPoints/this.screenRatio;
            this.heightPoints = this.widthPoints*this.screenRatio;
        }
    }

    clearCanvas() {
        this.context.fillStyle = this.globalBackgroundColor;
        this.context.fillRect(0,0, this.canvas.width, this.canvas.height);
    }

    draw(subject) {
        this.context.save();
        this.context.shadowBlur = subject.shadowSize;
        this.context.globalAlpha = subject.alpha;
        let destinationPosition = this.InvertY(this.pointsToPixels(subject.position));
        let destinationSize = this.pointsToPixels(subject.size);

        let canvasTransalation = {
            x : destinationPosition.x + (destinationSize.x/2),
            y : destinationPosition.y + (destinationSize.y/2)
        }
        this.context.translate(canvasTransalation.x, canvasTransalation.y);
        this.context.rotate((subject.rotation) * Math.PI / 180);
        this.context.translate(-canvasTransalation.x, -canvasTransalation.y);
        this.context.drawImage(
            this.loadedTexture,
            subject.sprites.rects[subject.activeSpriteIndex].x, subject.sprites.rects[subject.activeSpriteIndex].y,
            subject.sprites.rects[subject.activeSpriteIndex].w, subject.sprites.rects[subject.activeSpriteIndex].h,
            destinationPosition.x, destinationPosition.y,
            destinationSize.x, destinationSize.y
        );
        if(IS_DEBUG) {
            let hitboxPosition = this.InvertY(this.pointsToPixels({x: subject.hitboxPosX, y: subject.hitboxPosY}));
            let hitboxSize = this.pointsToPixels({x: subject.hitboxPosRightX-subject.posX, y: subject.posY-subject.hitboxPosDownY});

            this.context.beginPath();
            this.context.strokeStyle = '#0000FF';
            this.context.rect(hitboxPosition.x, hitboxPosition.y, hitboxSize.x, hitboxSize.y);
            this.context.stroke();
            this.context.closePath();

            this.context.beginPath();
            this.context.strokeStyle = '#343434';
            this.context.rect(destinationPosition.x, destinationPosition.y, destinationSize.x, destinationSize.y);
            this.context.stroke();
            this.context.closePath();
        }
        this.context.restore();
    }

    loadTexture(newTexture) {
        this.loadedTexture = newTexture;
    }

    pointsToPixels(point) {
        return {
            x : (this.canvas.width / this.widthPoints) * point.x,
            y : (this.canvas.height / this.heightPoints) * point.y
        };
    }

    InvertY(point) {
        point.y = this.canvas.height - point.y;
        return point;
    }
}