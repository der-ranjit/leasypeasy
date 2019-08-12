import { Square } from "../Engine/Shapes/Square";
import { Board } from "./Board";
import { Point } from "../Engine/Point";
import { Circle } from "../Engine/Shapes/Circle";
import { Color } from "../Engine/Color";
import { Renderer } from "../Engine/Renderer";
import { Shape, ShapeType } from "../Engine/Shapes/Shape";
import { Rectangle } from "../Engine/Shapes/Rectangle";

export class ShapedPiece {
    private shape!: Shape;

    public get position() {
        return this.shape.position;
    } 

    constructor(
        renderer: Renderer,
        private ownerBoard: Board,
        position: Point,
        public width: number,
        public fillColor: Color,
        public strokeColor: Color,
        public lineWidth = 1,
        public shapeType: ShapeType,
    ) {
        if (shapeType === Circle) {
            const radius = this.width / 2;
            this.shape = new Circle(position, radius, renderer, fillColor, strokeColor, lineWidth);
        }
        if (shapeType === Square) {
            this.shape = new Square(position, width, renderer, fillColor, strokeColor, lineWidth)
        }
        
        if (this.shape) {
            this.shape.centerArountPoint(position);
        }
    }

    public destroy() {
        this.shape.destroy();
    }

    public moveRight(moveDistance: number) {
        let newX = this.shape.position.x + moveDistance;
        const width = this.shapeType === Square ? this.width : this.width / 2;
        if (newX + width < this.ownerBoard.position.x + this.ownerBoard.totalWidth) {
            this.shape.position.x = newX;
        }
    }
    
    public moveLeft(moveDistance: number) {
        let newX = this.shape.position.x - moveDistance;
        if (newX >= 0) {
            this.shape.position.x = newX;
        }
    }

    public moveUp(moveDistance: number) {
        let newY = this.shape.position.y - moveDistance;
        if (newY > 0) {
            this.shape.position.y = newY;
        }
    }

    public moveDown(moveDistance: number) {
        let newY = this.shape.position.y + moveDistance;
        const width = this.shapeType === Square ? this.width : this.width / 2;
        if (newY + width < this.ownerBoard.position.y + this.ownerBoard.totalHeight) {
            this.shape.position.y = newY;
        }
    }

    public setColor(fill: Color, stroke: Color) {
        this.fillColor = fill;
        this.strokeColor = stroke;
        this.shape.setColor(fill, stroke);
    }
}