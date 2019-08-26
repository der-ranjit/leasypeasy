import { RenderObject } from "../RenderObject";
import { Renderer } from "../Renderer";
import { Point } from "../Point";
import { Color } from "../Color";
import { Circle } from "./Circle";
import { Square } from "./Square";
import { Rectangle } from "./Rectangle";
import { Controls } from "../Controls";

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
    
    public acceleration = 0;
    public abstract centerArountPoint(point: Point): void;
    public abstract updateShape(delta: number): void;

    public update(delta: number) {
        if (this.isControlled) {
            if (this.controls.isKeyPressed("ArrowLeft")) {
                this.velocity.x = -this.speed
                this.acceleration = 0.98;
            }
            if (this.controls.isKeyPressed("ArrowRight")) {
                this.velocity.x = this.speed;
                this.acceleration = 0.98;
            }
            if (this.controls.isKeyPressed("ArrowDown")) {
                this.velocity.y = this.speed;
                this.acceleration = 0.98;
            }
            if (this.controls.isKeyPressed("ArrowUp")) {
                this.velocity.y = -this.speed;
                this.acceleration = 0.98;
            }
        }

        this.move(this.velocity);
        this.velocity.multiply(this.acceleration);
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
        // console.log(<any>shape instanceof Rectangle);
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