import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Color } from "./Color";
import { Renderer } from "./Renderer";

export class Square extends Rectangle {
    constructor (
        public position: Point,
        public width: number,
        public fillColor = Color.BLACK,
        public strokeColor = Color.BLACK,
        public renderer: Renderer
    ) {
        super(position, width, width, fillColor, strokeColor, renderer);
    }
}