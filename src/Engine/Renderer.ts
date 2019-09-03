import { Subject } from "rxjs";
import { RenderObject } from "./RenderObject";
import { CollisionResolver, BoundaryRect } from "./CollisionResolver";
import { Shape } from "./Shapes/Shape.abstract";

export class Renderer {
    public onLoopStart$ = new Subject<RenderObject[]>(); 
    public onUpdate$ = new Subject<RenderObject[]>();
    public onCollisionDetection$ = new Subject<RenderObject[]>();
    public onDraw$ = new Subject<RenderObject[]>();
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
            // TODO: refactor:
            // delta_t = ...
            // let z = physics.calculate(delta_t);
            // z = collision.correct(z);
            // z.updatePositions();
            // renderer.draw();
            // 
            const zIndexSortedRenderObjects = this.renderObjects.sort((a, b) => {
                return a.zIndex - b.zIndex;
            });
            this.onLoopStart$.next(zIndexSortedRenderObjects);
            
            const delta = Date.now() - this.lastRenderTimestamp;
            this.context.clearRect(0 , 0, this.context.canvas.width, this.context.canvas.height);

            if (this.started) {
                this.onUpdate$.next(zIndexSortedRenderObjects);
                for (const object of zIndexSortedRenderObjects) {
                    object.update(delta);
                }

                // collision detection
                this.onCollisionDetection$.next(zIndexSortedRenderObjects);
                for (const object of zIndexSortedRenderObjects) {
                    CollisionResolver.checkAndResolveBoundaries(
                        object as Shape,
                        {
                            left: 0,
                            top: 0,
                            right: this.context.canvas.width,
                            bottom: this.context.canvas.height
                        }
                    );
                }
            } else {
                this.context.strokeText("PAUSED", 10, 10);
            }
            this.onDraw$.next(zIndexSortedRenderObjects);
            for (const object of zIndexSortedRenderObjects) {
                object.draw(delta);
            }
            
            this.onLoopEnd$.next();
            this.lastRenderTimestamp = Date.now();
            this.loop();
        });
    }
}