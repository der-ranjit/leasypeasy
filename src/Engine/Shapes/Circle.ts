import { Renderer } from "../Renderer";
import { Point } from "../Point";
import { Color } from "../Color";
import { Shape } from "./Shape.abstract";

export class Circle extends Shape {
    public showVelocityIndicator = false; 
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
        if (this.showVelocityIndicator) {
            const indicatorRadius = this.radius / 5;
            const velocityIndicatorCircleX = this.position.x + this.velocity.x * (this.radius - indicatorRadius);
            const velocityIndicatorCirlceY = this.position.y + this.velocity.y * (this.radius - indicatorRadius);
            // velocity indicator line
            this.context.strokeStyle = Color.RED.toString();
            this.context.fillStyle = Color.RED.toString();
            this.context.beginPath();
            this.context.moveTo(this.position.x, this.position.y);
            this.context.lineTo(velocityIndicatorCircleX, velocityIndicatorCirlceY);
            this.context.closePath();
            this.context.stroke();
            // velocity indicator circle
            this.context.beginPath();
            this.context.arc(velocityIndicatorCircleX, velocityIndicatorCirlceY, indicatorRadius , 0, Math.PI * 2);
            this.context.fill();
            this.context.closePath();
            if (this.gravityEnabled) {
                this.context.strokeStyle = this.strokeColor.toString();
                const gravityIndicatorScale = 20;
                const gravityIndicatorCircleX = this.position.x + this.gravity.x * gravityIndicatorScale * (this.radius - indicatorRadius);
                const gravityIndicatorCirlceY = this.position.y + this.gravity.y * gravityIndicatorScale * (this.radius - indicatorRadius);
                // gravity indicator line
                this.context.beginPath();
                this.context.moveTo(this.position.x, this.position.y);
                this.context.lineTo(gravityIndicatorCircleX, gravityIndicatorCirlceY);
                this.context.closePath();
                this.context.stroke();
                // gravity indicator circle
                this.context.fillStyle = this.strokeColor.toString();
                this.context.beginPath();
                this.context.arc(gravityIndicatorCircleX, gravityIndicatorCirlceY, indicatorRadius , 0, Math.PI * 2);
                this.context.fill();
                this.context.closePath();
            }
        }
        if (this.showStats) {
            this.context.strokeStyle = this.strokeColor.toString();
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
                posY + lineHeigt * 2
            );
            this.context.strokeText(
                `mass (${this.mass})`,
                posX,
                posY + lineHeigt * 3
            );
            const gravityText = this.gravityEnabled ? `gravity (${this.gravity.x.toFixed(4)} | ${this.gravity.y.toFixed(4)})` :
                `gravity disabled`
            this.context.strokeText(
                gravityText,
                posX,
                posY + lineHeigt * 4
            );
            this.context.strokeText(
                this.isControlled ? 'controlled' : 'unctonrolled',
                posX,
                posY + lineHeigt * 5
            );
        }

        this.context.restore();
    }

    public centerArountPoint(point: Point) {
        this.position = point;
    }
}