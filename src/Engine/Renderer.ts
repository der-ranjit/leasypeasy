import { Subject } from "rxjs";
import { RenderObject } from "./RenderObject";

export class Renderer {
    public onLoopStart$ = new Subject<void>(); 
    public onBeforeUpdate$ = new Subject<void>(); 
    public onLoopEnd$ = new Subject<void>();
    
    public get isRunning(): boolean {
        return this.started;
    }

    private renderObjects: RenderObject[] = [];
    private started = false;
    private lastRenderTimestamp = 0;

    constructor(public context: CanvasRenderingContext2D) {
        this.start();
    }

    
    public unpause() {
        this.started = true;
    }
    
    public pause() {
        this.started = false;
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
    
    private start() {
        this.started = true;
        this.lastRenderTimestamp = Date.now();
        this.loop();
    }

    private loop() {
        requestAnimationFrame(() => {
            this.onLoopStart$.next();

            const delta = Date.now() - this.lastRenderTimestamp;
            this.context.clearRect(0 , 0, this.context.canvas.width, this.context.canvas.height);
            const zIndexSortedRenderObjects = this.renderObjects.sort((a, b) => {
                return a.zIndex - b.zIndex;
            });
            if (this.started) {
                this.onBeforeUpdate$.next();
                for (const object of zIndexSortedRenderObjects) {
                    object.update(delta);
                }
            } else {
                this.context.strokeText("PAUSED", 10, 10);
            }
            for (const object of zIndexSortedRenderObjects) {
                object.draw(delta);
            }
            
            this.onLoopEnd$.next();
            this.lastRenderTimestamp = Date.now();
            this.loop();
        });
    }
}