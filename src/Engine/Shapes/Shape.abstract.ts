import { Renderer } from "../Renderer";
import { RenderObject } from "../RenderObject";
import { Color } from "../Color";
import { Controls } from "../Controls";
import { Point } from "../Point";
import { MathUtils } from "../MathUtils";
import { Vector2D } from "../Vector2D";

// careful - circular dependencie
import { CollisionResolver, BoundaryRect } from "../CollisionResolver";

export abstract class Shape extends RenderObject {
    public checkBoundary = true;

    // TODO move into constructor
    public speed = 0;
    public isControlled = false
    
    private controls = Controls.getInstance();

    constructor(
        public position: Point,
        renderer: Renderer,
        fillColor: Color,
        strokeColor: Color,
        lineWidth: number
    ) {
        super(renderer, fillColor, strokeColor, lineWidth);
    }

    public direction = new Vector2D(0, 0);

    public acceleration = 0.98;
    public gravity = new Vector2D(0, 1);
    public gravityEnabled = false;

    public gravitationSource: any | null = null;

    public abstract centerArountPoint(point: Point): void;
    public abstract updateShape(delta: number): void;

    public update(delta: number) {
        if (this.isControlled) {
            if (this.controls.isKeyPressed("ArrowLeft")) {
                this.direction.x = -1;
                this.speed = 1;
            }
            if (this.controls.isKeyPressed("ArrowRight")) {
                this.direction.x = 1;
                this.speed = 1;
            }
            if (this.controls.isKeyPressed("ArrowDown")) {
                this.direction.y = 1;
                this.speed = 1;
            }
            if (this.controls.isKeyPressed("ArrowUp")) {
                this.direction.y = -1;
                this.speed = 1;
            }
        }
        
        const movementVector = Vector2D.from(this.direction).setLength(this.speed);
        
        if (this.gravityEnabled) {
            if (this.gravitationSource) {
                const pullVector = Vector2D.directional(this.position, this.gravitationSource.position);
                const distance = pullVector.getLength();

                const massA = (<any>this).radius * 10;
                const massB = this.gravitationSource.radius * 10;
                const g = Math.pow(6.67430, -2);
                if (distance > 1) {
                    const force = (g * massA * massB) / (distance * distance);
                    this.gravity = pullVector.setLength(MathUtils.clamp(0, 100, force));
                }
            }
            movementVector.add(this.gravity);
        }

        this.move(movementVector);
        this.speed *= this.acceleration;
        if (this.speed <= 0.01) {
            this.speed = 0;
        }
        
        this.updateShape(delta);
    }

    public move(vector: Vector2D) {
        if (vector.x === 0 && vector.y === 0) {
            return;
        }
        const newPosition = Point.add(this.position, vector.point)
        if (this.checkBoundary) {
            const boundaryRect: BoundaryRect = {
                left: 0,
                top: 0,
                right: this.renderer.context.canvas.width,
                bottom: this.renderer.context.canvas.height
            }
            const resolved = CollisionResolver.checkAndResolveBoundaries(
                newPosition,
                this,
                boundaryRect
            );
            if (resolved) {
                return;
            }
        }
        this.position = newPosition;
    }
    
}