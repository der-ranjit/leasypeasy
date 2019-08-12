import { RenderObject } from "../RenderObject";
import { Renderer } from "../Renderer";
import { Point } from "../Point";
import { Color } from "../Color";
import { Circle } from "./Circle";
import { Rectangle } from "./Rectangle";
import { Square } from "./Square";

export type ShapeType = typeof Circle | typeof Square | typeof Rectangle;

export abstract class Shape extends RenderObject {
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
}