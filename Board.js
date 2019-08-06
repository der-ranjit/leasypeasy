import {isEven} from "./Utils.js";
import { Square } from "./Square.js";

export class Board {
    board;
    fieldWidth;
    context;
    columns;
    rows;
    totalWidth;
    totalHeight;
    
    pieces = [];

    constructor(columns, rows, fieldWidth, context) {
        this.columns = columns;
        this.rows = rows;
        this.fieldWidth = fieldWidth;
        this.context = context;
        this.board = this.createBoard(columns, rows);
        this.totalWidth = this.columns * this.fieldWidth;
        this.totalHeight = this.rows * this.fieldWidth;
    }

    createBoard(columns, rows) {
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

    createPiece(startColumn, startRow, width, color = "white") {
        const offsetCenterX = this.fieldWidth / 2 - width / 2;
        const offsetCenterY = this.fieldWidth / 2 - width / 2;
        const posX = startColumn * this.fieldWidth + offsetCenterX;
        const posY = startRow * this.fieldWidth + offsetCenterY;
        const piece = new Square(posX, posY, width, color, this.context);
        this.pieces.push(piece);
        return piece;
    }

    movePieceRight(piece) {
        let newX = piece.x;
        newX += this.fieldWidth;
        if (newX + piece.width < this.totalWidth) {
            piece.x = newX;
        }
    }
    
    movePieceLeft(piece) {
        let newX = piece.x;
        newX -= this.fieldWidth;
        if (newX >= 0) {
            piece.x = newX;
        }
    }

    movePieceUp(piece) {
        let newY = piece.y;
        newY -= this.fieldWidth;
        if (newY > 0) {
            piece.y = newY;
        }
    }

    movePieceDown(piece) {
        let newY = piece.y;
        newY += this.fieldWidth;
        if (newY + piece.width < this.totalHeight) {
            piece.y = newY;
        }
    }
}