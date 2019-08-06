import {isEven} from "../Utils";
import { Square } from "../Engine/Square";
import { Piece } from "./Piece";
import { Controls } from "../Engine/Controls";
import { RenderObject } from "../Engine/RenderObject";

export class Board extends RenderObject {
    public field: Array<number[]>;
    public totalWidth: number;
    public totalHeight: number;
    
    private pieces: Piece[] = [];
    private player: Piece | null = null;


    constructor(public columns: number, public rows: number, public fieldWidth: number, public context: CanvasRenderingContext2D) {
        super();
        this.field = this.createBoard(columns, rows);
        this.totalWidth = this.columns * this.fieldWidth;
        this.totalHeight = this.rows * this.fieldWidth;

        this.initControls();
    }

    public update() {

    }

    public draw() {

    }

    public createBoard(columns: number, rows: number): Array<number[]> {
        const field = new Array(columns);
        for (let i = 0; i < columns; i++) {
            field[i] = [];
        }
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                if (!isEven(x) && isEven(y) || isEven(x) && !isEven(y)) {
                    field[x][y] = new Square(x * this.fieldWidth, y * this.fieldWidth, this.fieldWidth, "black", this.context); 
                } else {
                    field[x][y] = new Square(x * this.fieldWidth, y * this.fieldWidth, this.fieldWidth, "grey", this.context); 
                }
            }   
        }
        return field;
    }

    public createPlayer(startColumn: number, startRow: number, width: number, color = "white"): Piece {
        if(!this.player) {
            const player = this.createPiece(startColumn, startRow, width, color);
            this.player = player;
        }
        return this.player;
    }

    public addPiece(startColumn: number, startRow: number, width: number, color?: string): Piece {
        const piece = this.createPiece(startColumn, startRow, width, color);
        this.pieces.push(piece);
        return piece;
    }

    private createPiece(startColumn: number, startRow: number, width: number, color = "black"): Piece {
        const offsetCenterX = this.fieldWidth / 2 - width / 2;
        const offsetCenterY = this.fieldWidth / 2 - width / 2;
        const posX = startColumn * this.fieldWidth + offsetCenterX;
        const posY = startRow * this.fieldWidth + offsetCenterY;
        const piece = new Piece(posX, posY, width, color, this, this.context);
        return piece;
    }

    private initControls() {
        const controls = Controls.getInstance();
        controls.onLeft(() => {
            if (this.player) {
                this.player.moveLeft(this.fieldWidth)
            }
        });
        controls.onUp(() => {
            if (this.player) {
                this.player.moveUp(this.fieldWidth)
            }
        });
        controls.onRight(() => {
            if (this.player) {
                this.player.moveRight(this.fieldWidth)
            }
        });
        controls.onDown(() => {
            if (this.player) {
                this.player.moveDown(this.fieldWidth)
            }
        });
    }
    
}