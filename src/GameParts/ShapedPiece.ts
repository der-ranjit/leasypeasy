import { Square } from "../Engine/Shapes/Square";
import { Board } from "./Board";
import { Point } from "../Engine/Point";
import { Circle } from "../Engine/Shapes/Circle";
import { Color } from "../Engine/Color";
import { Renderer } from "../Engine/Renderer";

export enum PieceShape {
    SQUARE,
    CIRCLE
}

export class ShapedPiece {
    private shape: Square | Circle;

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
        public shapeType = PieceShape.SQUARE,
    ) {
        let posX = this.ownerBoard.position.x + position.x * this.ownerBoard.fieldWidth;
        let posY = this.ownerBoard.position.y + position.y * this.ownerBoard.fieldWidth;
        let shapePosition = new Point(posX, posY);
        switch(shapeType) {
            case PieceShape.SQUARE:
                this.shape = this.createCenteredSquare(shapePosition, renderer);
                break;
            case PieceShape.CIRCLE:
                this.shape = this.createCenteredCircle(shapePosition, renderer);
                break;
            default:
                this.shape = this.createCenteredSquare(shapePosition, renderer);
                break;
        }
    }

    public destroy() {
        this.shape.removeFromRenderer();
    }

    public moveRight(moveDistance: number) {
        let newX = this.shape.position.x + moveDistance;
        const width = this.shapeType === PieceShape.SQUARE ? this.width : this.width / 2;
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
        const width = this.shapeType === PieceShape.SQUARE ? this.width : this.width / 2;
        if (newY + width < this.ownerBoard.position.y + this.ownerBoard.totalHeight) {
            this.shape.position.y = newY;
        }
    }

    public setColor(fill: Color, stroke: Color) {
        this.fillColor = fill;
        this.strokeColor = stroke;
        this.shape.fillColor = fill;
        this.shape.strokeColor = stroke;
    }

    private createCenteredSquare(position: Point, renderer: Renderer): Square {
        const offsetCenterX = this.ownerBoard.fieldWidth / 2 - this.width / 2;
        const offsetCenterY = this.ownerBoard.fieldWidth / 2 - this.width / 2;
        position.x += offsetCenterX;
        position.y += offsetCenterY;
        return new Square(renderer, position, this.width, this.fillColor, this.strokeColor, this.lineWidth);
    }

    private createCenteredCircle(position: Point, renderer: Renderer): Circle {
        const radius = this.width / 2;
        const offsetCenterX = this.ownerBoard.fieldWidth / 2;
        const offsetCenterY = this.ownerBoard.fieldWidth / 2;
        position.x += offsetCenterX;    
        position.y += offsetCenterY;
        return new Circle(renderer, position, radius, this.fillColor, this.strokeColor, this.lineWidth);
    }
}