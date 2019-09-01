import { Renderer } from "../Renderer";
import { Point } from "../Point";
import { Color } from "../Color";
import { Shape } from "./Shape.abstract";
import { Circle } from "./Circle";
import { Vector2D } from "../Vector2D";

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

    public updateShape(delta: number) {
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

    public gravitateTo(circle: Circle) {
        return new Vector2D(0, 0);
    }
}