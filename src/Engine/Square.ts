import { Point } from "./Point";
import { Rectangle } from "./Rectangle";

export class Square extends Rectangle {
    constructor (
        public position: Point,
        public width: number,
        public color = "black",
        public context: CanvasRenderingContext2D
    ) {
        super(position, width, width, color, context);
    }
}