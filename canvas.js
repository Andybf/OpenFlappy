export default class Canvas extends HTMLElement {

    maxHeight = new Number();
    zoomFactor = 1;
    widthPoints = 10;
    heightPoints = 10;
    context;
    canvas;

    subject;

    constructor() {
        super();
        this.innerHTML = '<canvas></canvas>';
    }

    connectedCallback() {
        this.canvas = this.querySelector('canvas');
        this.canvas.height = 512;
        this.canvas.width = 512;
        this.context = this.canvas.getContext('2d');
        this.clearCanvas();
    }

    clearCanvas() {
        this.context.fillStyle = '#EFEFEF';
        this.context.fillRect(0,0, this.canvas.width, this.canvas.height);
    }
    
    draw(subject) {
        this.context.beginPath();
        let coords = this.InvertY(this.pointsToPixels(subject.position));
        let sizes = this.pointsToPixels(subject.size);
        this.context.rect(coords.x, coords.y, sizes.x, sizes.y);
        this.context.fillStyle = subject.color;
        this.context.fill();
        this.context.closePath();
    }

    print(message) {
        this.context.beginPath();
        this.context.fillStyle = '#343434';
        this.context.font = '16px Arial';
        this.context.fillText(
            message,
            0 + 0,
            0 + 16
        );
        this.context.closePath();
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