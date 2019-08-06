export class Controls {
    static INSTANCE;

    static getInstance() {
        if (!Controls.INSTANCE) {
            Controls.INSTANCE = new Controls();
        }
        return Controls.INSTANCE;
    }

    leftFunctions = []
    rightFunctions = []
    upFunctions = []
    downFunctions = []

    constructor() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                this.rightFunctions.forEach(method => method());
            } 
            if (event.key === "ArrowLeft") {
                this.leftFunctions.forEach(method => method());
            } 
            if (event.key === "ArrowUp") {
                this.upFunctions.forEach(method => method());
            } 
            if (event.key === "ArrowDown") {
                this.downFunctions.forEach(method => method());
            } 
        });
    }

    onLeft(method) {
        this.leftFunctions.push(method);
    }
    
    onRight(method) {
        this.rightFunctions.push(method);
    }
    
    onUp(method) {
        this.upFunctions.push(method);
    }

    onDown(method) {
        this.downFunctions.push(method);
    }

}