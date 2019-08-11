import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Color } from "./Color";
import { Renderer } from "./Renderer";

export class Square extends Rectangle {
    constructor (
        public position: Point,
        public width: number,
        public color = Color.BLACK,
        public renderer: Renderer
    ) {
        super(position, width, width, color, renderer);
    }
}