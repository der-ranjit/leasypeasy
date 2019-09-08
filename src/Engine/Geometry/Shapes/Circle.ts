import { Color } from "../../utils";
import { Point } from "../Point";
import { Vector2D } from "../Vector2D";
import { Shape } from "./Shape";
import { MainLoop } from "../../MainLoop";
import { DrawConfiguration } from "../../GameObject";

export class Circle extends Shape {
    public showVelocityIndicator = false; 
    public showStats = false; 

    constructor (
        position: Point,
        public radius: number,
        mainLoop: MainLoop,
        drawConfiguration: DrawConfiguration
    ) {
        super(position, mainLoop, drawConfiguration);
        this.physics.mass = radius * radius * Math.PI;
    }

    public updateShape(delta: number) {

    }
    
    public drawShape(delta: number) {
        this.drawCircle();

        if (this.showVelocityIndicator) {
           this.drawVectorIndicator(this.physics.velocity, Color.RED);
            if (this.physics.gravityEnabled) {
                this.drawVectorIndicator(this.physics.gravityVector, Color.BLACK, 20);
            }
        }

        if (this.showStats) {
            this.drawStats();
        }
    }

    public centerArountPoint(point: Point) {
        this.position = point;
    }

    private drawCircle() {
        this.context.save();

        this.context.fillStyle = this.drawConfiguration.fillColor.toString();
        this.context.strokeStyle = this.drawConfiguration.strokeColor.toString();
        this.context.lineWidth = this.drawConfiguration.lineWidth
        
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

        this.context.strokeStyle = this.drawConfiguration.strokeColor.toString();
        const lineHeigt = 15;
        const posX = this.position.x + this.radius + 2;
        const posY = this.position.y - this.radius
        const stats = [
            this.physics.gravityEnabled ? `gravity (${this.physics.gravityVector.x.toFixed(4)} | ${this.physics.gravityVector.y.toFixed(4)})` : `gravity disabled`,
            `velocity (${this.physics.velocity.x.toFixed(4)} | ${this.physics.velocity.y.toFixed(4)}) | ${this.physics.velocity.getLength().toFixed(2)}`,
            `mass (${this.physics.mass})`
        ]
        
        stats.forEach((stat, index) => {
            this.context.strokeText(stat, posX, posY + lineHeigt * index)
        });

        this.context.restore();
    }
}