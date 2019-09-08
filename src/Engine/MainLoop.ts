import { Subject } from "rxjs";
import { BoundaryRect, Collision } from "./Collision";
import { Renderer } from "./Renderer";
import { Physics } from "./Physics";
import { GameObject } from "./GameObject";


export class MainLoop {
    public onLoopStart$ = new Subject<GameObject[]>(); 
    public onUpdate$ = new Subject<GameObject[]>();
    public onPhysics$ = new Subject<GameObject[]>();
    public onCollisionDetection$ = new Subject<GameObject[]>();
    public onRender$ = new Subject<GameObject[]>();
    public onLoopEnd$ = new Subject<GameObject[]>();

    public get isRunning(): boolean {
        return this.started;
    }
    
    private started = false;
    private lastLoopTimestamp = 0;

    private gameObjects: GameObject[] = [];
    private get contextBoundaries(): BoundaryRect {
        return {
            left: 0,
            top: 0,
            right: this.context.canvas.width,
            bottom: this.context.canvas.height
        }
    }

    constructor(public readonly context: CanvasRenderingContext2D) {
        this.start();
    }

    public togglePause() {
        this.started = !this.started;
    }

    public unpause() {
        this.started = true;
    }
    
    public pause() {
        this.started = false;
    }
    
    public addGameObject(gameObject: GameObject) {
        const index = this.getIndex(gameObject);
        if (index === -1) {
            this.gameObjects.push(gameObject);
        } 
    }
    
    public removeGameObject(gameObject: GameObject) {
        const index = this.getIndex(gameObject);
        if (index !== -1) {
            this.gameObjects.splice(index, 1);
        }
    }

    public removeAllGameObjects() {
        this.gameObjects.forEach(gameObject => {
            gameObject.destroy();
        })
        this.gameObjects = [];
    }
    
    private start() {
        this.started = true;
        this.lastLoopTimestamp = Date.now();
        this.loop();
    }

    private loop() {
        requestAnimationFrame(() => {
            this.onLoopStart$.next(this.gameObjects);
            const delta = Date.now() - this.lastLoopTimestamp;
            
            if (this.started) {
                this.onUpdate$.next();
                for (const object of this.gameObjects) {
                    object.update(delta);
                }

                this.onPhysics$.next(this.gameObjects);
                Physics.applyPhysics(this.gameObjects, delta);

                this.onCollisionDetection$.next(this.gameObjects);
                Collision.detectAndResolveCollisions(this.gameObjects, this.contextBoundaries);
            } else {
                this.context.strokeText("PAUSED", 10, 10);
            }

            this.onRender$.next(this.gameObjects);
            Renderer.draw(this.context, this.gameObjects, delta);
            
            this.onLoopEnd$.next(this.gameObjects);
            this.lastLoopTimestamp = Date.now();
            this.loop();
        });
    }

    private getIndex(gameObject: GameObject): number {
        return this.gameObjects.findIndex(gObject => gObject.id === gameObject.id);
    }
}


