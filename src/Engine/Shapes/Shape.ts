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

    public abstract centerArountPoint(point: Point): void;
    public abstract updateShape(delta: number): void;

    public update(delta: number) {
        if (this.isControlled) {
            if (this.controls.isLeftPressed) {
                this.move(new Point(-1, 0).multiply(this.speed));
            }
            if (this.controls.isRightPressed) {
                this.move(new Point(1, 0).multiply(this.speed));
            }
            if (this.controls.isDownPressed) {
                this.move(new Point(0, 1).multiply(this.speed));
            }
            if (this.controls.isUpPressed) {
                this.move(new Point(0, -1).multiply(this.speed));
            }
        }

        this.updateShape(delta);
    }

    public move(point: Point) {
        const newPosition = Point.ADD(this.position, point)
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