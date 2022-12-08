export default class Canvas extends HTMLElement {

    maxHeight = new Number();
    widthPoints = 10;
    heightPoints = 10;
    context;
    canvas;

    constructor() {
        super();
        this.innerHTML = '<canvas></canvas>';
    }

    connectedCallback() {
        this.canvas = this.querySelector('canvas');
        this.canvas.height = 512;
        this.canvas.width = 512;
        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;
        this.clearCanvas();
    }

    clearCanvas() {
        this.context.fillStyle = '#EFEFEF';
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
            subject.sprites.texture,
            subject.sprites.activeIndex*subject.sprites.width, 0,
            subject.sprites.width, subject.sprites.height,
            destinationPosition.x, destinationPosition.y,
            destinationSize.x, destinationSize.y
        );

        this.context.restore();
        this.context.closePath();
    }

    print(...messages) {
        messages.forEach( (message, index) => {
            this.context.beginPath();
            this.context.fillStyle = '#343434';
            this.context.font = '16px Arial';
            this.context.fillText(
                message.toString(),
                0,
                16+ index*16
            );
            this.context.closePath();
        });
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