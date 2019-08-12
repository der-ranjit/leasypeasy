import { randomInt} from "../Utils";
import { Square } from "../Engine/Shapes/Square";
import { ShapeType } from "../Engine/Shapes/Shape";
import { ShapedPiece } from "./ShapedPiece";
import { Controls } from "../Engine/Controls";
import { RenderObject } from "../Engine/RenderObject";
import { Point } from "../Engine/Point";
import { Color } from "../Engine/Color";
import { Renderer } from "../Engine/Renderer";
import { Circle } from "../Engine/Shapes/Circle";

export class Board extends RenderObject {
    public field: Array<number[]>;
    public totalWidth: number;
    public totalHeight: number;
    
    private pieces: ShapedPiece[] = [];
    private player: ShapedPiece | null = null;
    private colors: Color[] = [
        Color.RED,
        Color.GREEN,
        Color.BLUE,
        Color.YELLOW,
        Color.MAGENTA,
        Color.CYAN
    ];

    constructor(
        public columns: number,
        public rows: number,
        public fieldWidth: number,
        public fieldHeight: number,
        public position: Point,
        public fieldColor: Color,
        public fieldOutlineColor: Color,
        renderer: Renderer
    ) {
        super(renderer, Color.BLACK, Color.BLACK, 1);
        this.field = this.createBoard(columns, rows);
        this.totalWidth = this.columns * this.fieldWidth;
        this.totalHeight = this.rows * this.fieldHeight;

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
                    this.position.y + y * this.fieldHeight
                );
                field[x][y] = new Square(position, this.fieldWidth, this.renderer, this.fieldColor, this.fieldOutlineColor); 
            }   
        }
        return field;
    }

    public createPlayer(column: number, row: number, width: number, fillColor = Color.BLACK, strokeColor = Color.BLACK): ShapedPiece {
        if(!this.player) {
            const playerLineWidth = 1;
            const player = this.createPiece(column, row, width, fillColor, strokeColor, playerLineWidth, Circle);
            this.player = player;
        }
        return this.player;
    }

    public addPiece(column: number, row: number, width: number, fillColor?: Color, strokeColor?: Color, lineWidth?: number): ShapedPiece {
        const piece = this.createPiece(column, row, width, fillColor, strokeColor, lineWidth);
        this.pieces.push(piece);
        return piece;
    }

    public addPieceAtMousePosition(mouseEvent: MouseEvent) {
        const mousePosition = new Point(mouseEvent.clientX, mouseEvent.clientY)
        const fieldCoords = this.getFieldCoordsByPoint(mousePosition); 
        this.addPiece(fieldCoords.x, fieldCoords.y, 20, Color.GREEN);
    }

    public addRandomPiece() {
        const randomFillColor = this.colors[randomInt(0, this.colors.length)];
        const randomColumn = randomInt(0, this.columns);
        const randomRow = randomInt(0, this.rows);
        const width = this.fieldWidth / 2;
        const lineWidth = 4;
        if (this.isFieldEmpty(randomColumn, randomRow)) {
            this.addPiece(randomColumn, randomRow, width, Color.WHITE, randomFillColor, lineWidth);
        }
    }

    public isFieldEmpty(column: number, row: number): boolean {
        return !this.pieces.find(piece => {
            const pieceField = this.getFieldCoordsByPoint(piece.position);
            return pieceField.x === column && pieceField.y === row;
        });
    }

    private createPiece(
        column: number,
        row: number,
        width: number,
        fillColor = Color.WHITE,
        strokeColor = Color.BLACK,
        lineWidth = 1,
        shapeType: ShapeType = Square
    ): ShapedPiece {
        let fieldCenterX = this.position.x + column * this.fieldWidth + this.fieldWidth / 2;
        let fieldCenterY = this.position.y + row * this.fieldHeight + this.fieldHeight / 2;
        const position = new Point(fieldCenterX, fieldCenterY);
        const piece = new ShapedPiece(this.renderer, this, position, width, fillColor, strokeColor, lineWidth, shapeType);
        return piece;
    }

    private getFieldCoordsByPoint(point: Point): Point {
        const fieldColumn = this.position.x + Math.floor(point.x / this.fieldWidth);
        const fieldRow = this.position.y + Math.floor(point.y / this.fieldHeight);
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
                const playerColor = Color.mix(player.fillColor, sameFieldPiece.strokeColor);
                player.setColor(playerColor, playerColor);
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
                this.player.moveUp(this.fieldHeight)
            }
        });
        controls.onRight(() => {
            if (this.player) {
                this.player.moveRight(this.fieldWidth)
            }
        });
        controls.onDown(() => {
            if (this.player) {
                this.player.moveDown(this.fieldHeight)
            }
        });
    }
}