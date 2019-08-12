import { RenderObject } from "../RenderObject";
import { Point } from "../Point";
import { Color } from "../Color";
import { Renderer } from "../Renderer";

export class Rectangle extends RenderObject {
    constructor (
        public renderer: Renderer,
        public position: Point,
        public width: number,
        public height: number,
        public fillColor = Color.BLACK,
        public strokeColor = Color.BLACK,
        public lineWidth = 1,
    ) {
        super(renderer);
    }

    public update(delta: number) {

    }

    public draw(delta: number) {
        this.renderer.context.save();

        this.renderer.context.fillStyle = this.fillColor.toString();
        this.renderer.context.strokeStyle = this.strokeColor.toString();
        this.renderer.context.lineWidth = this.lineWidth;

        this.renderer.context.beginPath();
        this.renderer.context.fillRect(this.position.x, this.position.y, this.width, this.height);
        this.renderer.context.strokeRect(this.position.x, this.position.y, this.width, this.height);

        this.renderer.context.restore();
    }
}