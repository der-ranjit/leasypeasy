import { Renderer } from "../Renderer";
import { RenderObject } from "../RenderObject";
import { Color } from "../Color";
import { Controls } from "../Controls";
import { Point } from "../Point";
import { MathUtils } from "../MathUtils";
import { Vector2D } from "../Vector2D";

// careful - circular dependencie
import { CollisionResolver, BoundaryRect } from "../CollisionResolver";
import { Circle } from "./Circle";

export abstract class Shape extends RenderObject {
    public checkBoundary = true;
    public isControlled = false
    public gravityEnabled = false;

    // TODO move into constructor
    public speed = 0;
    public frictionFactor = 0.95;
    public velocity = new Vector2D(0, 0);

    public mass = 1;
    public gravity = new Vector2D(0, 0);
    public gravitationSource: Circle | null = null;
    
    private controls = Controls.getInstance();

    public directionVector = new Vector2D(1, 0);

    public indicationVector = new Vector2D(0, 0);

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

    public update(delta: number) {
        // this.directionVector.setLength(this.speed);
        if (this.gravityEnabled) {
            if (this.gravitationSource) {
                const pullVector = Vector2D.directional(this.position, this.gravitationSource.position);
                let distance = pullVector.getLength();
                if (distance < 10) {
                    distance = 10;
                }
                const g = 0.1;
                const gravity = new Vector2D(
                    100 * pullVector.x / Math.pow(distance, 3),
                    100 * pullVector.y / Math.pow(distance, 3)
                );
                
                const speedVector = Vector2D.from(this.velocity).setLength(this.speed);
                this.velocity.add(gravity);
                this.gravity = this.velocity;
                
                this.indicationVector = Vector2D.from(this.velocity).add(speedVector)
                this.move(this.indicationVector);
            } 
        } else {
            const direction = Vector2D.from(this.directionVector).setLength(this.speed);
            this.velocity = direction;
            this.indicationVector = this.velocity
            this.move(this.indicationVector);
        }

        if (this.isControlled) {
            if (this.controls.isKeyPressed("ArrowLeft")) {
                this.velocity.rotate(-4);
                this.directionVector.rotate(-4);
            }
            if (this.controls.isKeyPressed("ArrowRight")) {
                this.velocity.rotate(4);
                this.directionVector.rotate(4);
            }
            if (this.controls.isKeyPressed("ArrowDown")) {
                this.speed -= 0.2;
            }
            if (this.controls.isKeyPressed("ArrowUp")) {
                this.speed += 0.2;
            }
        }

        
        this.speed = this.speed * this.frictionFactor;
        if (Math.abs(this.speed) <= 0.1) {
            this.speed = 0;
        }
        
        this.updateShape(delta);
    }

    public move(vector: Vector2D) {
        const newPosition = Point.add(this.position, vector.point)
        this.position = newPosition;

        if (this.checkBoundary) {
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
    
}