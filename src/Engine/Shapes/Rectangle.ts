import { RenderObject } from "../RenderObject";
import { Point } from "../Point";
import { Color } from "../Color";
import { Renderer } from "../Renderer";
import { Shape } from "./Shape";

export class Rectangle extends Shape {
    constructor (
        position: Point,
        public width: number,
        public height: number,
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
        this.context.lineWidth = this.lineWidth;

        this.context.beginPath();
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
        this.context.strokeRect(this.position.x, this.position.y, this.width, this.height);

        this.context.restore();
    }

    public centerArountPoint(point: Point) {
        const offsetX = this.width / 2;
        const offsetY = this.height / 2;
        const offsetPosition = new Point(-offsetX, -offsetY);
        this.position.add(offsetPosition);
    };
}