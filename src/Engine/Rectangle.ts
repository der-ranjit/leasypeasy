import { RenderObject } from "./RenderObject";
import { Point } from "./Point";
import { Color } from "./Color";

export class Rectangle extends RenderObject {
    constructor (
        public position: Point,
        public width: number,
        public height: number,
        public color = Color.BLACK,
        public context: CanvasRenderingContext2D
    ) {
        super();
    }

    public update(delta: number) {

    }

    public draw(delta: number) {
        this.context.fillStyle = this.color.toString();
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}