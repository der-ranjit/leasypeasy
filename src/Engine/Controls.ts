export class Controls {
    public static INSTANCE: Controls;

    public static getInstance() {
        if (!Controls.INSTANCE) {
            Controls.INSTANCE = new Controls();
        }
        return Controls.INSTANCE;
    }

    public isLeftPressed = false;
    public isRightPressed = false;
    public isUpPressed = false;
    public isDownPressed = false;

    private leftFunctions: Function[] = []
    private rightFunctions: Function[] = []
    private upFunctions: Function[] = []
    private downFunctions: Function[] = []

    constructor() {
        document.addEventListener("keydown", event => {
            if (event.key === "ArrowRight") {
                this.isRightPressed = true;
                this.rightFunctions.forEach(method => method());
            } 
            if (event.key === "ArrowLeft") {
                this.isLeftPressed = true;
                this.leftFunctions.forEach(method => method());
            } 
            if (event.key === "ArrowUp") {
                this.isUpPressed = true;
                this.upFunctions.forEach(method => method());
            } 
            if (event.key === "ArrowDown") {
                this.isDownPressed = true;
                this.downFunctions.forEach(method => method());
            } 
        });

        document.addEventListener("keyup", event =>  {
            if (event.key === "ArrowRight") {
                this.isRightPressed = false;
            } 
            if (event.key === "ArrowLeft") {
                this.isLeftPressed = false;
            } 
            if (event.key === "ArrowUp") {
                this.isUpPressed = false;
            } 
            if (event.key === "ArrowDown") {
                this.isDownPressed = false;
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