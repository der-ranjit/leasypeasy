import { RenderObject } from "./RenderObject";
import { Point } from "./Point";
import { Color } from "./Color";
import { Renderer } from "./Renderer";

export class Rectangle extends RenderObject {
    constructor (
        public position: Point,
        public width: number,
        public height: number,
        public fillColor = Color.BLACK,
        public strokeColor = Color.BLACK,
        public renderer: Renderer
    ) {
        super(renderer);
    }

    public update(delta: number) {

    }

    public draw(delta: number) {
        this.renderer.context.fillStyle = this.fillColor.toString();
        this.renderer.context.fillRect(this.position.x, this.position.y, this.width, this.height);
        this.renderer.context.strokeStyle = this.strokeColor.toString();
        this.renderer.context.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }
}