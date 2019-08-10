import { RenderObject } from "./RenderObject";
import { Point } from "./Point";
import { Color } from "./Color";

export class Circle extends RenderObject {
    constructor (
        public position: Point,
        public radius: number,
        public color = Color.BLACK,
        public context: CanvasRenderingContext2D
    ) {
        super();
    }

    public update(delta: number) {

    }

    public draw(delta: number) {
        this.context.fillStyle = this.color.toString();
        this.context.strokeStyle = this.color.toString();
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this.context.stroke();
        this.context.fill();
    }
}