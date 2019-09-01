import { Renderer } from "../Renderer";
import { RenderObject } from "../RenderObject";
import { Color } from "../Color";
import { Point } from "../Point";
import { Vector2D } from "../Vector2D";

// careful - circular dependencie
import { CollisionResolver, BoundaryRect } from "../CollisionResolver";
import { Circle } from "./Circle";
import { Subject } from "rxjs";

export abstract class Shape extends RenderObject {
    public onBoundaryCollision$ = new Subject<void>();
    public controls: null | (() => void) = null;
    
    public checkBoundaries = true;
    public gravityEnabled = false;

    public mass = 1;
    public gravitationSources: Circle[] = [];
    public velocity = new Vector2D(0, 0);

    protected gravityVector = new Vector2D(0, 0);
    
    private defaultGravity = new Vector2D(0, 0.1);

    constructor(
        public position: Point,
        renderer: Renderer,
        fillColor: Color,
        strokeColor: Color,
        lineWidth: number
    ) {
        super(renderer, fillColor, strokeColor, lineWidth);
    }


    public abstract centerArountPoint(point: Point): void;
    public abstract updateShape(delta: number): void;
    protected abstract gravitateTo(circle: Circle): Vector2D;

    public update(delta: number) {
        if (this.gravityEnabled) {
            this.gravityVector = this.computeGravity();
            this.velocity.add(this.gravityVector);
        } 
        
        if (this.controls && typeof this.controls === "function") {
            this.controls();
        }

        this.move(this.velocity);
        this.updateShape(delta);
    }

    public move(vector: Vector2D) {
        const newPosition = Point.add(this.position, vector.point)
        this.position = newPosition;

        if (this.checkBoundaries) {
            const boundaryRect: BoundaryRect = {
                left: 0,
                top: 0,
                right: this.renderer.context.canvas.width,
                bottom: this.renderer.context.canvas.height
            }
            CollisionResolver.checkAndResolveBoundaries(
                this,
                boundaryRect
            );
        }
    }

    private computeGravity(): Vector2D {
        let gravity = new Vector2D(0, 0);
        if (this.gravitationSources.length > 0) {
            for (const gravitationSource of this.gravitationSources) {
                gravity.add(this.gravitateTo(gravitationSource));
            }
        } else {
            const mass = this.mass / 50;
            gravity = Vector2D.scaled(this.defaultGravity, mass);
        }

        return gravity;
    }
}