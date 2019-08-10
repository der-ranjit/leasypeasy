import { Square } from "../Engine/Square";
import { Board } from "./Board";
import { Point } from "../Engine/Point";

export class Piece extends Square {
    constructor(
        public position: Point,
        public width: number,
        public color: string,
        private ownerBoard: Board,
        context: CanvasRenderingContext2D
    ) {
        super(position, width, color, context);
    }

    public moveRight(moveDistance: number) {
        let newX = this.position.x + moveDistance;
        // TODO use owner board position
        if (newX + this.width < this.ownerBoard.position.x + this.ownerBoard.totalWidth) {
            this.position.x = newX;
        }
    }
    
    public moveLeft(moveDistance: number) {
        let newX = this.position.x - moveDistance;
        // TODO use owner board position
        if (newX >= 0) {
            this.position.x = newX;
        }
    }

    public moveUp(moveDistance: number) {
        let newY = this.position.y - moveDistance;
         // TODO use owner board position
        if (newY > 0) {
            this.position.y = newY;
        }
    }

    public moveDown(moveDistance: number) {
        let newY = this.position.y + moveDistance;
         // TODO use owner board position
        if (newY + this.width < this.ownerBoard.position.y + this.ownerBoard.totalHeight) {
            this.position.y = newY;
        }
    }
}