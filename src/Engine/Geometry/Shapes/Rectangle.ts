import { Color } from "../../utils";
import { Point } from "../Point";
import { Vector2D } from "../Vector2D";
import { Shape } from "./Shape";
import { Circle } from "./Circle";
import { MainLoop } from "../../MainLoop";
import { DrawConfiguration } from "../../GameObject";

export class Rectangle extends Shape {
    constructor (
        position: Point,
        public width: number,
        public height: number,
        mainLoop: MainLoop,
        drawConfiguration: DrawConfiguration,
    ) {
        super(position, mainLoop, {
            fillColor: drawConfiguration.fillColor || Color.BLACK,
            strokeColor: drawConfiguration.strokeColor || Color.BLACK,
            lineWidth: drawConfiguration.lineWidth || 1
        });
    }

    public updateShape(delta: number) {
    }

    public drawShape(delta: number) {
        this.context.save();

        this.context.fillStyle = this.drawConfiguration.fillColor.toString();
        this.context.strokeStyle = this.drawConfiguration.strokeColor.toString();
        this.context.lineWidth = this.drawConfiguration.lineWidth;

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