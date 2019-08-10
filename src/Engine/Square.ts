import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Color } from "./Color";

export class Square extends Rectangle {
    constructor (
        public position: Point,
        public width: number,
        public color = Color.BLACK,
        public context: CanvasRenderingContext2D
    ) {
        super(position, width, width, color, context);
    }
}