import { RenderObject } from "../RenderObject";
import { Renderer } from "../Renderer";
import { Point } from "../Point";
import { Color } from "../Color";
import { Circle } from "./Circle";
import { Rectangle } from "./Rectangle";
import { Square } from "./Square";
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
        
        this.updateShape(delta);
    }

    public move(point: Point) {
        if (point === Point.ORIGIN) {
            return;
        }
        const newPosition = Point.add(this.position, point)
        if (this.checkBoundary) {
            if (newPosition.x > this.renderer.context.canvas.width
                || newPosition.x < 0
                || newPosition.y > this.renderer.context.canvas.height
                || newPosition.y < 0
            ) {
                return;
            }
        }
        this.position = newPosition;
    }

    
}