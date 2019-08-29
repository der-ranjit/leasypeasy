import { Renderer } from "../Renderer";
import { RenderObject } from "../RenderObject";
import { Color } from "../Color";
import { Controls } from "../Controls";
import { Point } from "../Point";
import { Circle } from "./Circle";
import { Rectangle } from "./Rectangle";
import { Square } from "./Square";

export type ShapeType = typeof Circle | typeof Square | typeof Rectangle;

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

    public gravitationSource: Circle | null = null;

    public abstract centerArountPoint(point: Point): void;
    public abstract updateShape(delta: number): void;

    public update(delta: number) {
        if (this.isControlled) {
            if (this.controls.isKeyPressed("ArrowLeft")) {
                this.velocity.x = -this.speed
                // this.acceleration = 0.98;
            }
            if (this.controls.isKeyPressed("ArrowRight")) {
                this.velocity.x = this.speed;
                // this.acceleration = 0.98;
            }
            if (this.controls.isKeyPressed("ArrowDown")) {
                this.velocity.y = this.speed;
                // this.acceleration = 0.98;
            }
            if (this.controls.isKeyPressed("ArrowUp")) {
                this.velocity.y = -this.speed;
                // this.acceleration = 0.98;
            }
        }
        this.move(this.velocity);
        this.velocity.multiply(this.acceleration);
        if (this.gravityEnabled) {
            if (this.gravitationSource) {
                const vectorX = -this.position.x + this.gravitationSource.position.x;
                const vectorY = -this.position.y + this.gravitationSource.position.y;
                const length = Math.sqrt((vectorX * vectorX) + (vectorY * vectorY)); 
                const gravity = new Point(vectorX, vectorY);
                const distance = Point.distanceBetween(this.position, this.gravitationSource.position); 
                const massA = (<Circle><unknown>this).radius;
                const massB = this.gravitationSource.radius;
                const g = Math.pow(6.67430, -2);
                const force = (g * massA * massB) / (distance * distance);
                // this.gravity = gravity.multiply(1 / length).multiply(force);
                this.gravity = gravity.multiply(1 / length);
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
            const resolved = this.resolveBoundaries(newPosition);
            if (resolved) {
                return;
            }
        }
        this.position = newPosition;
    }

    private resolveBoundaries(newPosition: Point, shape = this): boolean {
        const leftEdge = 0;
        const rightEdge = this.renderer.context.canvas.width;
        const topEdge = 0;
        const bottomEdge = this.renderer.context.canvas.height

        // TODO WHY??
        // const rect = new Rectangle(new Point(0, 0), 20, 20, this.renderer);
        // console.log((<any>shape).constructor);
        if ((<any>shape).width && (<any>shape).height) {
            if (newPosition.x + (<any>shape).width > rightEdge || newPosition.x < leftEdge) {
                this.velocity.x = -this.velocity.x;
                return true;
            }
            if (newPosition.y + (<any>shape).height > bottomEdge || newPosition.y < topEdge) {
                this.velocity.y = -this.velocity.y;
                return true;
            }
        }
        if (shape instanceof Circle) {
            if (newPosition.x + shape.radius > rightEdge || newPosition.x - shape.radius < leftEdge) {
                this.velocity.x = -this.velocity.x;
                return true;
            }
            if (newPosition.y + shape.radius > bottomEdge || newPosition.y - shape.radius < topEdge) {
                this.velocity.y = -this.velocity.y;
                return true;
            }
        }

        return false;
    }

    
}