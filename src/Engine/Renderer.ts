import { RenderObject } from "./RenderObject";

export class Renderer {
    public static INSTANCE: Renderer;

    public static getInstance() {
        if (!Renderer.INSTANCE) {
            Renderer.INSTANCE = new Renderer();
        } 
        return Renderer.INSTANCE;
    }
    
    private renderObjects: RenderObject[] = [];
    private started = false;
    private lastRenderTimestamp = 0;

    constructor() {
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