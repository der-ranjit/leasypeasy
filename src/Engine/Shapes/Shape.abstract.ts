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
import { Subject } from "rxjs";

export abstract class Shape extends RenderObject {
    public left = "ArrowLeft";
    public up = "ArrowUp";
    public right = "ArrowRight";
    public down = "ArrowDown";

    public onBoundaryCollision$ = new Subject<void>();

    public checkBoundary = true;
    public isControlled = false
    public gravityEnabled = false;

    // TODO move into constructor
    public speed = 0;
    public frictionFactor = 0.95;
    public velocity = new Vector2D(0, 0);

    public mass = 1;
    public gravity = new Vector2D(0, 0);
    public gravitationSources: Circle[] = [];
    private defaultGravity = new Vector2D(0, 0.1);

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
        if (this.gravityEnabled) {
            if (this.gravitationSources.length > 0) {
                const gravity = new Vector2D(0, 0);
                for (const gravitationSource of this.gravitationSources) {
                    gravity.add(this.gravitateTo(gravitationSource));
                }
                this.gravity = gravity;
            } else {
                const mass = this.mass / 50;
                this.gravity = Vector2D.scaled(this.defaultGravity, mass);
            }
            this.velocity.add(this.gravity);
        } 
        
        if (this.isControlled) {
            const currentLength = this.velocity.getLength();
            if (this.controls.isKeyPressed(this.left)) {
                this.velocity.rotate(-4);;
            }
            if (this.controls.isKeyPressed(this.right)) {
                this.velocity.rotate(4);
            }
            if (this.controls.isKeyPressed(this.down)) {
                const deccelerate = 0.2;
                let newLength = currentLength - deccelerate;
                newLength = (newLength < 0) ? 0 : newLength;
                this.velocity.setLength(newLength);
            }
            if (this.controls.isKeyPressed(this.up)) {
                const accelerate = 0.1;
                const maxSpeed = 5;
                let newLength = currentLength + accelerate;
                newLength = (newLength > maxSpeed) ? maxSpeed : newLength;
                this.velocity.setLength(newLength);
            }
        }
        
        this.move(this.velocity);
        
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

    private gravitateTo(circle: Circle): Vector2D {
        const gravity = new Vector2D(0, 0);
		let distance = Point.distanceBetween(this.position, circle.position);
        const radii = (<Circle><unknown>this).radius + circle.radius;
        if (distance < radii) {
            distance = radii;
        }
        const mass = circle.mass / 2;
		gravity.setLength(mass / (distance * distance));
		gravity.setAngle(this.angleTo(circle));
		return gravity;
    }

    private angleTo(circle: Circle) {
        return Math.atan2(circle.position.y - this.position.y, circle.position.x - this.position.x);
    }
}