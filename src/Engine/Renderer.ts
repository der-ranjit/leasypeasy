import { RenderObject } from "./RenderObject";

export class Renderer {
    private renderObjects: RenderObject[] = [];
    private started = false;
    private lastRenderTimestamp = 0;

    constructor(public context: CanvasRenderingContext2D) {
        this.start();
    }

    public start() {
        this.started = true;
        this.lastRenderTimestamp = Date.now();
        this.loop();
    }
    
    public addRenderObject(renderObject: RenderObject) {
        this.renderObjects.push(renderObject);
    }

    public removeRenderObject(renderObject: RenderObject) {
        const index = this.renderObjects.indexOf(renderObject);
        if (index !== -1) {
            this.renderObjects.splice(index, 1);
        }
    }

    public stop() {
        this.started = false;
    }


    private loop() {
        if (this.started) {
            requestAnimationFrame(() => {
                const delta = Date.now() - this.lastRenderTimestamp;
                this.context.clearRect(0 , 0, this.context.canvas.width, this.context.canvas.height);
                for (const object of this.renderObjects) {
                    object.update(delta);
                    object.draw(delta);
                }
                this.lastRenderTimestamp = Date.now();
                this.loop();
            });
        }
    }
}