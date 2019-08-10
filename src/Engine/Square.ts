import { RenderObject } from "./RenderObject";
import { Point } from "./Point";

export class Square extends RenderObject {
    constructor (
        public position: Point,
        public width: number,
        public color = "black",
        public context: CanvasRenderingContext2D
    ) {
        super();
    }

    public update(delta: number) {

    }

    public draw(delta: number) {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.position.x, this.position.y, this.width, this.width);
    }

}