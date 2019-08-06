import {isEven} from "./Utils";
import { Square } from "./Square";

export class Board {
    public field: Array<number[]>;
    public totalWidth: number;
    public totalHeight: number;
    
    private pieces: Square[] = [];

    constructor(public columns: number, public rows: number, public fieldWidth: number, public context: CanvasRenderingContext2D) {
        this.field = this.createBoard(columns, rows);
        this.totalWidth = this.columns * this.fieldWidth;
        this.totalHeight = this.rows * this.fieldWidth;
    }

    public createBoard(columns: number, rows: number): Array<number[]> {
        const board = new Array(columns);
        for (let i = 0; i < columns; i++) {
            board[i] = [];
        }
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                if (!isEven(x) && isEven(y) || isEven(x) && !isEven(y)) {
                    board[x][y] = new Square(x * this.fieldWidth, y * this.fieldWidth, this.fieldWidth, "black", this.context); 
                } else {
                    board[x][y] = new Square(x * this.fieldWidth, y * this.fieldWidth, this.fieldWidth, "grey", this.context); 
                }
            }   
        }
        return board;
    }

    public createPiece(startColumn: number, startRow: number, width: number, color = "white") {
        const offsetCenterX = this.fieldWidth / 2 - width / 2;
        const offsetCenterY = this.fieldWidth / 2 - width / 2;
        const posX = startColumn * this.fieldWidth + offsetCenterX;
        const posY = startRow * this.fieldWidth + offsetCenterY;
        const piece = new Square(posX, posY, width, color, this.context);
        this.pieces.push(piece);
        return piece;
    }

    public movePieceRight(piece: Square) {
        let newX = piece.posX;
        newX += this.fieldWidth;
        if (newX + piece.width < this.totalWidth) {
            piece.posX = newX;
        }
    }
    
    public movePieceLeft(piece: Square) {
        let newX = piece.posX;
        newX -= this.fieldWidth;
        if (newX >= 0) {
            piece.posX = newX;
        }
    }

    public movePieceUp(piece: Square) {
        let newY = piece.posY;
        newY -= this.fieldWidth;
        if (newY > 0) {
            piece.posY = newY;
        }
    }

    public movePieceDown(piece: Square) {
        let newY = piece.posY;
        newY += this.fieldWidth;
        if (newY + piece.width < this.totalHeight) {
            piece.posY = newY;
        }
    }
}