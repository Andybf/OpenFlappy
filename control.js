export default class Control {

    canvas;
    subject;

    target = {
        position : {
            x : 0,
            y : 0
        },
        size : {
            x : 10,
            y : 1
        }
    };

    isSimulationRunning = false;
    oneSecond = 1000;
    tickInterval = 60;
    gravity = 0.001;

    constructor(subject, canvas) {
        this.canvas = canvas;
        this.subject = subject;

        window.addEventListener('keyup', (event) => {
            console.log(event);
            this.subject.setForce(0);
            this.subject.addForce(0.0825);

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
            this.calcMovement(this.subject);
            this.canvas.clearCanvas();
            this.canvas.draw(this.subject);
            this.canvas.print(this.subject.position.y.toFixed(6));
            
            (!this.isSimulationRunning) && clearInterval(this.interval);
        },
        this.oneSecond / this.tickInterval);
    }

    calcMovement(subject) {
        if (this.hasCollide(this.subject, this.target)) {
            this.subject.setForce(
                Number((this.subject.size.y - this.subject.position.y + this.gravity).toFixed(6))
            );
        } else {
            subject.addForce( - this.gravity);
        }
        subject.position.y += Number(subject.movement.force.toFixed(6));
    }

    hasCollide(subject, target) {
        return (subject.posDownY+this.subject.movement.force) < target.position.y ||
                subject.posDownY < target.position.y
    }
}