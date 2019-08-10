import {isEven} from "../Utils";
import { Square } from "../Engine/Square";
import { ShapedPiece, PieceShape } from "./ShapedPiece";
import { Controls } from "../Engine/Controls";
import { RenderObject } from "../Engine/RenderObject";
import { Point } from "../Engine/Point";
import { Color } from "../Engine/Color";

export class Board extends RenderObject {
    public field: Array<number[]>;
    public totalWidth: number;
    public totalHeight: number;
    
    private pieces: ShapedPiece[] = [];
    private player: ShapedPiece | null = null;


    constructor(
        public columns: number,
        public rows: number,
        public fieldWidth: number,
        public position: Point,
        public context: CanvasRenderingContext2D
    ) {
        super();
        this.field = this.createBoard(columns, rows);
        this.totalWidth = this.columns * this.fieldWidth;
        this.totalHeight = this.rows * this.fieldWidth;

        this.initControls();
    }

    public update() {
        this.checkForSameField();
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
                const position = new Point(
                    this.position.x + x * this.fieldWidth,
                    this.position.y + y * this.fieldWidth
                );
                if (!isEven(x) && isEven(y) || isEven(x) && !isEven(y)) {
                    field[x][y] = new Square(position, this.fieldWidth, Color.BLACK, this.context); 
                } else {
                    field[x][y] = new Square(position, this.fieldWidth, Color.GREY, this.context); 
                }
            }   
        }
        return field;
    }

    public createPlayer(column: number, row: number, width: number, color = Color.WHITE): ShapedPiece {
        if(!this.player) {
            const player = this.createPiece(column, row, width, color, PieceShape.CIRCLE);
            this.player = player;
        }
        return this.player;
    }

    public addPiece(column: number, row: number, width: number, color?: Color): ShapedPiece {
        const piece = this.createPiece(column, row, width, color);
        this.pieces.push(piece);
        return piece;
    }

    public addPieceAtMousePosition(mouseEvent: MouseEvent) {
        const mousePosition = new Point(mouseEvent.clientX, mouseEvent.clientY)
        const fieldCoords = this.getFieldCoordsByPoint(mousePosition); 
        this.addPiece(fieldCoords.x, fieldCoords.y, 20, Color.GREEN);
    }

    public isFieldEmpty(column: number, row: number): boolean {
        return !this.pieces.find(piece => {
            const pieceField = this.getFieldCoordsByPoint(piece.position);
            return pieceField.x === column && pieceField.y === row;
        });
    }

    private createPiece(column: number, row: number, width: number, color = Color.BLACK, shapeType = PieceShape.SQUARE): ShapedPiece {
        const position = new Point(column, row);
        const piece = new ShapedPiece(position, width, color, shapeType, this, this.context);
        return piece;
    }

    private getFieldCoordsByPoint(point: Point): Point {
        const fieldColumn = this.position.x + Math.floor(point.x / this.fieldWidth);
        const fieldRow = this.position.y + Math.floor(point.y / this.fieldWidth);
        return new Point(fieldColumn, fieldRow);
    }

    private checkForSameField() {
        const player = this.player;
        if (player) {
            const playerField = this.getFieldCoordsByPoint(player.position);
            const sameFieldPiece = this.pieces.find(piece => {
                const pieceField = this.getFieldCoordsByPoint(piece.position);
                return pieceField.x === playerField.x && pieceField.y === playerField.y
            });
            
            if (sameFieldPiece) {
                player.setColor(Color.mix(player.color, sameFieldPiece.color));
                this.removePiece(sameFieldPiece);
            }
        }
    }

    private removePiece(piece: ShapedPiece) {
        const index = this.pieces.indexOf(piece);
        this.pieces.splice(index, 1);
        piece.destroy();
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