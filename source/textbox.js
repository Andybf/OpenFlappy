export default class Textbox {

    linePointer;
    rowGap;
    canvasRef;
    printFontSize;
    shadowBlur;

    padding = {
        top: 10,
        right : 10,
        bottom : 10,
        left : 10
    }

    shouldDrawBackground = true;

    printHeightPercent = 0.25;
    printWidthPercent = 0.50;

    constructor(canvas) {
        this.linePointer = 0;
        this.rowGap = 10;
        this.printFontSize = 22;
        this.shadowBlur = 20;
        this.canvasRef = canvas;
    }

    print(message) {
        this.canvasRef.context.font = `${this.printFontSize}px Comic Sans MS`;

        let lines = message.toString().split('\n').length;
        if (this.shouldDrawBackground) {
            this.applyBackground(message.toString(), lines);
        }
        
        this.canvasRef.context.fillStyle = 'white';
        this.canvasRef.context.textAlign = 'center';
        this.canvasRef.context.shadowColor = "black";
        this.canvasRef.context.shadowBlur = 10;
        message.toString().split('\n').forEach( substring => {
            this.canvasRef.context.fillText(
                substring,
                this.printWidth,
                this.printHeight + (this.linePointer * (this.printFontSize+this.rowGap))
            );
            this.linePointer++;
        });
        this.linePointer = 0;
    }

    applyBackground(message, lines) {
        this.canvasRef.context.globalAlpha = 0.200;
        this.canvasRef.context.fillStyle = '#000';
        this.canvasRef.context.shadowColor = '#EEE';
        this.canvasRef.context.shadowBlur = 4;
        this.canvasRef.context.beginPath();
        this.canvasRef.context.roundRect(
            this.printWidth - (this.getWidthMeasure(message)/2) - this.padding.left,
            (this.printHeight - this.printFontSize) - this.padding.top,
            this.getWidthMeasure(message) + (this.padding.right*2),
            ((this.printFontSize+this.rowGap) * lines) + (this.padding.bottom*2),
            10
        );
        this.canvasRef.context.fill();
        this.canvasRef.context.globalAlpha = 1.0;
    }

    getWidthMeasure(message) {
        return this.canvasRef.context.measureText(message).width;
    }

    get printHeight() {
        return this.canvasRef.canvas.height*this.printHeightPercent;
    }

    get printWidth() {
        return this.canvasRef.canvas.width*this.printWidthPercent;
    }
}