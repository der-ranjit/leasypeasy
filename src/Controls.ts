export class Controls {
    public static INSTANCE: Controls;

    public static getInstance() {
        if (!Controls.INSTANCE) {
            Controls.INSTANCE = new Controls();
        }
        return Controls.INSTANCE;
    }

    private leftFunctions: Function[] = []
    private rightFunctions: Function[] = []
    private upFunctions: Function[] = []
    private downFunctions: Function[] = []

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

    public onLeft(method: Function) {
        this.leftFunctions.push(method);
    }
    
    public onRight(method: Function) {
        this.rightFunctions.push(method);
    }
    
    public onUp(method: Function) {
        this.upFunctions.push(method);
    }

    public onDown(method: Function) {
        this.downFunctions.push(method);
    }

}