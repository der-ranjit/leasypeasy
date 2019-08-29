import { Subject } from "rxjs";
import { RenderObject } from "./RenderObject";

export class Renderer {
    public static onLoopStart$ = new Subject<void>();
    public static onLoopEnd$ = new Subject<void>();


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
                Renderer.onLoopStart$.next();

                const delta = Date.now() - this.lastRenderTimestamp;
                this.context.clearRect(0 , 0, this.context.canvas.width, this.context.canvas.height);
                const zIndexSortedRenderObjects = this.renderObjects.sort((a, b) => {
                    return a.zIndex - b.zIndex;
                });
                for (const object of zIndexSortedRenderObjects) {
                    object.update(delta);
                    object.draw(delta);
                }
                
                Renderer.onLoopEnd$.next();
                this.lastRenderTimestamp = Date.now();
                this.loop();
            });
        }
    }
}