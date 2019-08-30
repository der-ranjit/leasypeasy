import { Renderer } from "../Renderer";
import { Point } from "../Point";
import { Color } from "../Color";
import { Shape } from "./Shape.abstract";

export class Circle extends Shape {
    public showDirectionIndicator = false; 
    public showStats = false; 

    constructor (
        position: Point,
        public radius: number,
        renderer: Renderer,
        fillColor = Color.BLACK,
        strokeColor = Color.BLACK,
        lineWidth = 1,
    ) {
        super(position, renderer, fillColor, strokeColor, lineWidth);
        this.mass = radius * radius * Math.PI;
    }

    public updateShape(delta: number) {

    }
    
    public draw(delta: number) {
        this.context.save();

        this.context.fillStyle = this.fillColor.toString();
        this.context.strokeStyle = this.strokeColor.toString();
        this.context.lineWidth = this.lineWidth
        
        // main circle
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this.context.stroke();
        this.context.fill();
        this.context.closePath();
        if (this.showDirectionIndicator) {
            const indicatorRadius = this.radius / 5;
            const indicatorCircleX = this.position.x + this.velocity.x * (this.radius - indicatorRadius);
            const indicatorCirlceY = this.position.y + this.velocity.y * (this.radius - indicatorRadius);
            // indicator line
            this.context.beginPath();
            this.context.moveTo(this.position.x, this.position.y);
            this.context.lineTo(indicatorCircleX, indicatorCirlceY);
            this.context.closePath();
            this.context.stroke();
            // indicator circle
            this.context.fillStyle = this.strokeColor.toString();
            this.context.beginPath();
            this.context.arc(indicatorCircleX, indicatorCirlceY, indicatorRadius , 0, Math.PI * 2);
            this.context.fill();
            this.context.closePath();
        }
        if (this.showStats) {
            const lineHeigt = 15;
            const posX = this.position.x + this.radius + 2;
            const posY = this.position.y - this.radius
            this.context.strokeText(
                `speed ${this.speed.toFixed(2)}`,
                posX,
                posY
            );
            this.context.strokeText(
                `velocity (${this.velocity.x.toFixed(4)} | ${this.velocity.y.toFixed(4)}) | ${this.velocity.getLength().toFixed(2)}`,
                posX,
                posY + lineHeigt
            );
            this.context.strokeText(
                `mass (${this.mass})`,
                posX,
                posY + lineHeigt * 2
            );
            const gravityText = this.gravityEnabled ? `gravity (${this.gravity.x.toFixed(4)} | ${this.gravity.y.toFixed(4)})` :
                `gravity disabled`
            this.context.strokeText(
                gravityText,
                posX,
                posY + lineHeigt * 3
            );
            this.context.strokeText(
                this.isControlled ? 'controlled' : 'unctonrolled',
                posX,
                posY + lineHeigt * 4
            );
        }

        this.context.restore();
    }

    public centerArountPoint(point: Point) {
        this.position = point;
    } 
}