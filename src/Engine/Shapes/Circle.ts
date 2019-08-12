import { Point } from "../Point";
import { Color } from "../Color";
import { Renderer } from "../Renderer";
import { Shape } from "./Shape";

export class Circle extends Shape {
    constructor (
        position: Point,
        public radius: number,
        renderer: Renderer,
        fillColor = Color.BLACK,
        strokeColor = Color.BLACK,
        lineWidth = 1,
    ) {
        super(position, renderer, fillColor, strokeColor, lineWidth);
    }

    public update(delta: number) {

    }

    public draw(delta: number) {
        this.context.save();

        this.context.fillStyle = this.fillColor.toString();
        this.context.strokeStyle = this.strokeColor.toString();
        this.context.lineWidth = this.lineWidth

        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this.context.stroke();
        this.context.fill();

        this.context.restore();
    }
}