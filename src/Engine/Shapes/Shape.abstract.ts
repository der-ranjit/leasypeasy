import { Renderer } from "../Renderer";
import { RenderObject } from "../RenderObject";
import { Color } from "../Color";
import { Controls } from "../Controls";
import { Point } from "../Point";

// careful - circular dependencie
import { CollisionResolver, BoundaryRect } from "../CollisionResolver";

export abstract class Shape extends RenderObject {
    public checkBoundary = true;

    // TODO move into constructor
    public speed = 1;
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

    public velocity = new Point(0, 0);
    
    public acceleration = 0.98;
    public gravity = new Point(0, 1);
    public gravityEnabled = false;

    public gravitationSource: any | null = null;

    public abstract centerArountPoint(point: Point): void;
    public abstract updateShape(delta: number): void;

    public update(delta: number) {
        if (this.isControlled) {
            if (this.controls.isKeyPressed("ArrowLeft")) {
                this.velocity.x = -this.speed
            }
            if (this.controls.isKeyPressed("ArrowRight")) {
                this.velocity.x = this.speed;
            }
            if (this.controls.isKeyPressed("ArrowDown")) {
                this.velocity.y = this.speed;
            }
            if (this.controls.isKeyPressed("ArrowUp")) {
                this.velocity.y = -this.speed;
            }
        }

        this.move(this.velocity.multiply(this.speed));
        this.velocity.multiply(this.acceleration);
        if (this.gravityEnabled) {
            if (this.gravitationSource) {
                const vectorX = -this.position.x + this.gravitationSource.position.x;
                const vectorY = -this.position.y + this.gravitationSource.position.y;
                const length = Math.sqrt((vectorX * vectorX) + (vectorY * vectorY)); 
                const gravity = new Point(vectorX, vectorY);
                const distance = Point.distanceBetween(this.position, this.gravitationSource.position); 
                const massA = (<any><unknown>this).radius * 10;
                const massB = this.gravitationSource.radius * 10;
                const g = Math.pow(6.67430, -2);
                const force = (g * massA * massB) / (distance * distance);
                // this.gravity = gravity.multiply(force / (length));
                this.gravity = gravity.multiply(0.25 / (length));
            }
            this.velocity.add(this.gravity);
        }
        if (Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
            this.velocity = new Point(0, 0);
        }
        
        this.updateShape(delta);
    }

    public move(point: Point) {
        if (point.x === 0 && point.y === 0) {
            return;
        }
        const newPosition = Point.add(this.position, point)
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