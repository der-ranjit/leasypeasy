import { Subject } from "rxjs";
import { BoundaryRect, isCollidable, Collidable, Collision } from "./Collision";
import { isDrawable, Drawable, Renderer } from "./Renderer";
import { isPhysicObject, PhysicObject, Physics } from "./Physics";
import { GameObject } from "./GameObject";


export class MainLoop {
    public onLoopStart$ = new Subject<GameObject[]>(); 
    public onUpdate$ = new Subject<GameObject[]>();
    public onPhysics$ = new Subject<PhysicObject[]>();
    public onCollisionDetection$ = new Subject<Collidable[]>();
    public onRender$ = new Subject<Drawable[]>();
    public onLoopEnd$ = new Subject<GameObject[]>();

    public renderer: Renderer;

    public get isRunning(): boolean {
        return this.started;
    }
    
    private started = false;
    private lastLoopTimestamp = 0;

    private gameObjects: GameObject[] = [];
    private canvasBoundaries: BoundaryRect = {
        left: 0,
        top: 0,
        right: this.renderer.context.canvas.width,
        bottom: this.renderer.context.canvas.height
    }

    constructor(context: CanvasRenderingContext2D) {
        this.renderer = new Renderer(context);
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
        this.gameObjects.push(gameObject);
    }
    
    public removeGameObject(gameObject: GameObject) {
        const index = this.gameObjects.indexOf(gameObject);
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

                const physicObjects = this.gameObjects.filter(object => isPhysicObject(object)) as unknown as PhysicObject[];
                this.onPhysics$.next(physicObjects);
                Physics.applyPhysics(physicObjects, delta);

                const collisionObjects = this.gameObjects.filter(object => isCollidable(object)) as unknown as Collidable[];
                this.onCollisionDetection$.next(collisionObjects);
                Collision.detectAndResolveCollisions(collisionObjects, this.canvasBoundaries);
            } else {
                this.renderer.context.strokeText("PAUSED", 10, 10);
            }

            const drawableObjects = this.gameObjects.filter(object => isDrawable(object)) as unknown as Drawable[];
            this.onRender$.next(drawableObjects);
            this.renderer.draw(drawableObjects, delta);
            
            this.onLoopEnd$.next(this.gameObjects);
            this.lastLoopTimestamp = Date.now();
            this.loop();
        });
    }
}


