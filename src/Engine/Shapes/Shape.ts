import { RenderObject } from "../RenderObject";
import { Renderer } from "../Renderer";
import { Point } from "../Point";
import { Color } from "../Color";
import { Circle } from "./Circle";
import { Rectangle } from "./Rectangle";
import { Square } from "./Square";

export type ShapeType = typeof Circle | typeof Square | typeof Rectangle;

export abstract class Shape extends RenderObject {
    public checkBoundary = true;

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