import { Renderer } from "../Renderer";
import { Point } from "../Point";
import { Color } from "../Color";
import { Shape } from "./Shape.abstract";
import { Vector2D } from "../Vector2D";

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
        this.drawCircle();

        if (this.showVelocityIndicator) {
           this.drawVectorIndicator(this.velocity, Color.RED);
            if (this.gravityEnabled) {
                this.drawVectorIndicator(this.gravityVector, Color.BLACK, 20);
            }
        }

        if (this.showStats) {
            this.drawStats();
        }
    }

    public centerArountPoint(point: Point) {
        this.position = point;
    }

    public gravitateTo(circle: Circle): Vector2D {
        const gravity = new Vector2D(0, 0);
        
        let distance = Point.distanceBetween(this.position, circle.position);
        const radii = this.radius + circle.radius;
        if (distance < radii) {
            distance = radii;
        }
        
        const mass = (this.mass + circle.mass) / 2;
		gravity.setLength(mass / (distance * distance));
		gravity.setAngle(this.position.angleTo(circle.position));
		return gravity;
    }

    private drawCircle() {
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

        this.context.restore();
    }

    private drawVectorIndicator(vector: Vector2D, color: Color, scale = 1) {
        this.context.save();
        
        this.context.strokeStyle = color.toString();
        this.context.fillStyle = color.toString();

        const indicatorRadius = this.radius / 5;
        const indicatorCircleX = this.position.x + vector.x * scale * (this.radius - indicatorRadius);
        const indicatorCirlceY = this.position.y + vector.y * scale * (this.radius - indicatorRadius);
        
        // indicator line
        this.context.beginPath();
        this.context.moveTo(this.position.x, this.position.y);
        this.context.lineTo(indicatorCircleX, indicatorCirlceY);
        this.context.closePath();
        this.context.stroke();
        
        // indicator  circle
        this.context.beginPath();
        this.context.arc(indicatorCircleX, indicatorCirlceY, indicatorRadius , 0, Math.PI * 2);
        this.context.fill();
        this.context.closePath();

        this.context.restore();
    }

    private drawStats() {
        this.context.save();

        this.context.strokeStyle = this.strokeColor.toString();
        const lineHeigt = 15;
        const posX = this.position.x + this.radius + 2;
        const posY = this.position.y - this.radius
        const stats = [
            this.gravityEnabled ? `gravity (${this.gravityVector.x.toFixed(4)} | ${this.gravityVector.y.toFixed(4)})` : `gravity disabled`,
            `velocity (${this.velocity.x.toFixed(4)} | ${this.velocity.y.toFixed(4)}) | ${this.velocity.getLength().toFixed(2)}`,
            `mass (${this.mass})`
        ]
        
        stats.forEach((stat, index) => {
            this.context.strokeText(stat, posX, posY + lineHeigt * index)
        });

        this.context.restore();
    }
}