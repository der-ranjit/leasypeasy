import { Square } from "../Engine/Square";
import { Board } from "./Board";
import { Point } from "../Engine/Point";
import { Circle } from "../Engine/Circle";

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
        position: Point,
        public width: number,
        public color: string,
        public shapeType: PieceShape,
        private ownerBoard: Board,
        context: CanvasRenderingContext2D
    ) {
        let posX = this.ownerBoard.position.x + position.x * this.ownerBoard.fieldWidth;
        let posY = this.ownerBoard.position.y + position.y * this.ownerBoard.fieldWidth;
        let shapePosition = new Point(posX, posY);
        switch(shapeType) {
            case PieceShape.SQUARE:
                this.shape = this.createCenteredSquare(shapePosition, context);
                break;
            case PieceShape.CIRCLE:
                this.shape = this.createCenteredCircle(shapePosition, context);
                break;
            default:
                this.shape = this.createCenteredSquare(shapePosition, context);
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

    private createCenteredSquare(position: Point, context: CanvasRenderingContext2D): Square {
        const offsetCenterX = this.ownerBoard.fieldWidth / 2 - this.width / 2;
        const offsetCenterY = this.ownerBoard.fieldWidth / 2 - this.width / 2;
        position.x += offsetCenterX;
        position.y += offsetCenterY;
        return new Square(position, this.width, this.color, context);
    }

    private createCenteredCircle(position: Point, context: CanvasRenderingContext2D): Circle {
        const radius = this.width / 2;
        const offsetCenterX = this.ownerBoard.fieldWidth / 2;
        const offsetCenterY = this.ownerBoard.fieldWidth / 2;
        position.x += offsetCenterX;    
        position.y += offsetCenterY;
        return new Circle(position, radius, this.color, context);
    }
}