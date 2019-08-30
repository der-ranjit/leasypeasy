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
    public acceleration = 0.98;
    public direction = new Vector2D(1, 0);

    public mass = 1;
    public gravity = new Vector2D(0, 1);
    public gravitationSource: Circle | null = null;
    
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


    public abstract centerArountPoint(point: Point): void;
    public abstract updateShape(delta: number): void;

    public update(delta: number) {
        if (this.isControlled) {
            if (this.controls.isKeyPressed("ArrowLeft")) {
                this.direction.rotate(-4);
            }
            if (this.controls.isKeyPressed("ArrowRight")) {
                this.direction.rotate(4);
            }
            if (this.controls.isKeyPressed("ArrowDown")) {
                this.speed -= 0.2;
            }
            if (this.controls.isKeyPressed("ArrowUp")) {
                this.speed += 0.2;
            }
        }
        
        const movementVector = Vector2D.from(this.direction).setLength(this.speed);
        
        if (this.gravityEnabled) {
            if (this.gravitationSource) {
                const pullVector = Vector2D.directional(this.position, this.gravitationSource.position);
                const distance = pullVector.getLength();

                const g = Math.pow(6.67430, -2);
                if (distance > 1) {
                    const force = (g * this.mass * this.gravitationSource.mass) / (distance * distance);
                    this.gravity = pullVector.setLength(MathUtils.clamp(0, 50, force));
                }
            }
            movementVector.add(this.gravity);
        }

        this.move(movementVector);
        this.speed *= this.acceleration;
        if (Math.abs(this.speed) <= 0.01) {
            this.speed = 0;
        }
        
        this.updateShape(delta);
    }

    public move(vector: Vector2D) {
        if (vector.x === 0 && vector.y === 0) {
            return;
        }
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
                newPosition,
                this,
                boundaryRect
            );
        }
    }
    
}