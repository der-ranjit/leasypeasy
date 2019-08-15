import { Point } from "../Point";
import { Rectangle } from "./Rectangle";
import { Color } from "../Color";
import { Renderer } from "../Renderer";

export class Square extends Rectangle {
    constructor (
        position: Point,
        public width: number,
        renderer: Renderer,
        fillColor = Color.BLACK,
        strokeColor = Color.BLACK,
        lineWidth = 1
    ) {
        super(position, width, width, renderer, fillColor, strokeColor, lineWidth);
    }
}