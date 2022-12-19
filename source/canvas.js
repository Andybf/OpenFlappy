export default class Canvas extends HTMLElement {

    maxHeight = new Number();
    widthPoints;
    heightPoints;
    loadedTexture;
    globalBackgroundColor;
    context;
    canvas;

    constructor() {
        super();
        this.innerHTML = '<canvas></canvas>';
        this.globalBackgroundColor = '#78d2fd';
    }

    connectedCallback() {
        this.canvas = this.querySelector('canvas');
        this.canvas.height = 512;
        this.canvas.width = 512;
        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;
        this.clearCanvas();
        this.widthPoints = 10;
        this.heightPoints = 10;
    }

    clearCanvas() {
        this.context.fillStyle = this.globalBackgroundColor;
        this.context.fillRect(0,0, this.canvas.width, this.canvas.height);
    }
    
    draw(subject) {
        this.context.beginPath();
        this.context.save();

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
            subject.sprites.rects[subject.sprites.activeIndex].x, subject.sprites.rects[subject.sprites.activeIndex].y,
            subject.sprites.rects[subject.sprites.activeIndex].w, subject.sprites.rects[subject.sprites.activeIndex].h,
            destinationPosition.x, destinationPosition.y,
            destinationSize.x, destinationSize.y
        );

        this.context.restore();
        this.context.closePath();
    }

    print(message, line) {
        let padding = 10;
        this.context.beginPath();
        this.context.fillStyle = '#343434';
        this.context.font = '16px Arial';
        this.context.fillText(
            message.toString(),
            padding,
            line*16 +16+padding
        );
        this.context.closePath();
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