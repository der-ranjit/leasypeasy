import { Point } from "../Point";
import { Shape } from "./Shape";
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
        super(position, mainLoop, drawConfiguration);
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
}