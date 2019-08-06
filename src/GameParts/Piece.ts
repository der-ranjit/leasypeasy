import { Square } from "../Engine/Square";
import { Board } from "./Board";

export class Piece extends Square {
    constructor(
        public posX: number,
        public posY: number,
        public width: number,
        public color: string,
        private ownerBoard: Board,
        context: CanvasRenderingContext2D
    ) {
        super(posX, posY, width, color, context);
    }

    public moveRight(moveDistance: number) {
        let newX = this.posX + moveDistance;
        // TODO use owner board position
        if (newX + this.width < this.ownerBoard.totalWidth) {
            this.posX = newX;
        }
    }
    
    public moveLeft(moveDistance: number) {
        let newX = this.posX - moveDistance;
        // TODO use owner board position
        if (newX >= 0) {
            this.posX = newX;
        }
    }

    public moveUp(moveDistance: number) {
        let newY = this.posY - moveDistance;
         // TODO use owner board position
        if (newY > 0) {
            this.posY = newY;
        }
    }

    public moveDown(moveDistance: number) {
        let newY = this.posY + moveDistance;
         // TODO use owner board position
        if (newY + this.width < this.ownerBoard.totalHeight) {
            this.posY = newY;
        }
    }
}