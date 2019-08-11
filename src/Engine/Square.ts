import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Color } from "./Color";
import { Renderer } from "./Renderer";

export class Square extends Rectangle {
    constructor (
        public renderer: Renderer,
        public position: Point,
        public width: number,
        public fillColor = Color.BLACK,
        public strokeColor = Color.BLACK,
        public lineWidth = 1
    ) {
        super(renderer, position, width, width, fillColor, strokeColor, lineWidth);
    }
}