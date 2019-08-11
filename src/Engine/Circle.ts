import { RenderObject } from "./RenderObject";
import { Point } from "./Point";
import { Color } from "./Color";
import { Renderer } from "./Renderer";

export class Circle extends RenderObject {
    constructor (
        public position: Point,
        public radius: number,
        public color = Color.BLACK,
        public renderer: Renderer
    ) {
        super(renderer);
    }

    public update(delta: number) {

    }

    public draw(delta: number) {
        this.renderer.context.fillStyle = this.color.toString();
        this.renderer.context.strokeStyle = this.color.toString();
        this.renderer.context.beginPath();
        this.renderer.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this.renderer.context.stroke();
        this.renderer.context.fill();
    }
}