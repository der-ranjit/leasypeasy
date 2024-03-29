import { MainLoop, GameObject, DrawConfiguration } from "../../Engine";
import { Point } from "../../Engine/Geometry";
import { Color, Controls, MathUtils } from "../../Engine/utils";
import { ShapedPiece } from "./ShapedPiece";
import { Rectangle } from "../../Engine/Geometry/Shapes/Rectangle";
import { Square } from "../../Engine/Geometry/Shapes/Square";
import { ShapeType } from "../../Engine/Geometry/Shapes/Shape";
import { Circle } from "../../Engine/Geometry/Shapes/Circle";

export class BoardField {
    private rectangle!: Rectangle;

    public get position(): Point {
        return this.rectangle.position;
    }
    
    constructor(
        public column: number,
        public row: number,
    ) {}
}

export class Board extends GameObject {
    public field: Array<Square[]>;
    public get totalWidth(): number {
        return this.columns * this.fieldWidth;
    }
    public get totalHeight(): number {
        return this.rows * this.fieldHeight;
    }
    
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
        mainLoop: MainLoop
    ) {
        super(mainLoop, new DrawConfiguration(), Point.ORIGIN);
        this.field = this.createBoard(columns, rows);

        this.initControls();
    }

    public update() {
        this.checkForSameField();
    }

    public draw() {

    }

    public createBoard(columns: number, rows: number): Array<Square[]> {
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
                field[x][y] = new Square(position, this.fieldWidth, this.mainLoop, new DrawConfiguration(
                    this.fieldColor,
                    this.fieldOutlineColor,
                )); 
            }   
        }
        return field;
    }

    public createPlayer(column: number, row: number, width: number, fillColor = Color.BLACK, strokeColor = Color.BLACK): ShapedPiece {
        if(!this.player) {
            const playerLineWidth = 1;
            const player = this.createPiece(column, row, width, fillColor, strokeColor, playerLineWidth, Circle, 2);
            this.player = player;
        }
        return this.player;
    }

    public addColumn() {
        
    }

    public addField(position: Point) {
        // TODO calculate position correctly (board and canvas position)
        const column = Math.floor(position.x / this.fieldWidth);
        const row = Math.floor(position.y / this.fieldHeight);
        if (!this.existsField(column, row)) {
            if (!this.field[column]) {
                this.field[column] = [];
            }
            const squarePosition = new Point(
                0 + column * this.fieldWidth,
                0 + row * this.fieldHeight,
            )
            this.field[column][row] = new Square(squarePosition, this.fieldWidth, this.mainLoop, new DrawConfiguration(
                this.fieldColor,
                this.fieldOutlineColor,
            ));
        } else {
            this.field[column][row].destroy();
            this.field[column][row] = <any>null;
        }
    }

    public addRow() {
        for (let x = 0; x < this.columns; x++) {
            const lastSquareIndex = this.field[x].length - 1;
            const lastSquare = this.field[x][lastSquareIndex];
            const position = new Point(lastSquare.position.x, lastSquare.position.y + this.fieldHeight);
            this.field[x].push(new Square(position, this.fieldWidth, this.mainLoop, new DrawConfiguration(
                this.fieldColor,
                this.fieldOutlineColor,
            )));
        }
        this.rows++;
    }

    public addPiece(column: number, row: number, width: number, fillColor?: Color, strokeColor?: Color, lineWidth?: number): ShapedPiece {
        const piece = this.createPiece(column, row, width, fillColor, strokeColor, lineWidth);
        this.pieces.push(piece);
        return piece;
    }

    public addPieceAtMousePosition(mouseEvent: MouseEvent) {
        const mousePosition = new Point(mouseEvent.clientX, mouseEvent.clientY)
        const fieldCoords = this.getBoardFieldByPosition(mousePosition);
        if (fieldCoords) {
            this.addPiece(fieldCoords.x, fieldCoords.y, 20, Color.GREEN);
        }
    }

    public addRandomPiece() {
        const randomFillColor = this.colors[MathUtils.randomInt(0, this.colors.length)];
        const randomColumn = MathUtils.randomInt(0, this.field.length - 1);
        const exists = !!this.field[randomColumn];
        if (exists) {
            const randomRow = MathUtils.randomInt(0, this.field[randomColumn].length - 1);
            const width = this.fieldWidth / 2;
            const lineWidth = 4;
            const maxPieces = 6;
            if (this.existsField(randomColumn, randomRow) && this.isFieldEmpty(randomColumn, randomRow)) {
                const addedPiece = this.addPiece(randomColumn, randomRow, width, Color.WHITE, randomFillColor, lineWidth);
                addedPiece.startRandomColorChange(this.colors, 1000);
                if (this.pieces.length > maxPieces) {
                    const destroyPiece = this.pieces[0];
                    this.pieces.splice(0, 1);
                    destroyPiece.destroy();
                }
            }
        } else {
            this.addRandomPiece();
        }
    }

    public isFieldEmpty(column: number, row: number): boolean {
        return !this.pieces.find(piece => {
            const pieceField = this.getBoardFieldByPosition(piece.position);
            return pieceField && pieceField.x === column && pieceField.y === row;
        });
    }

    public existsField(column: number, row: number) {
        const result = this.field[column] && this.field[column][row];
        return !!result;
    }

    private createPiece(
        column: number,
        row: number,
        width: number,
        fillColor = Color.WHITE,
        strokeColor = Color.BLACK,
        lineWidth = 1,
        shapeType: ShapeType = Square,
        zIndex = 1
    ): ShapedPiece {
        const position = this.getCenterOfField(column, row);
        const piece = new ShapedPiece(this.mainLoop, this, position, width, fillColor, strokeColor, lineWidth, shapeType, zIndex);
        return piece;
    }

    public getBoardFieldByPosition(position: Point): Point | null {
        const fieldColumn = this.position.x + Math.floor(position.x / this.fieldWidth);
        const fieldRow = this.position.y + Math.floor(position.y / this.fieldHeight);
        if (this.existsField(fieldColumn, fieldRow)) {
            return new Point(fieldColumn, fieldRow);
        }
        return null;
    }

    public getCenterOfField(column: number, row: number): Point {
        let fieldCenterX = this.position.x + column * this.fieldWidth + this.fieldWidth / 2;
        let fieldCenterY = this.position.y + row * this.fieldHeight + this.fieldHeight / 2;
        const position = new Point(fieldCenterX, fieldCenterY);
        return position;
    }

    private checkForSameField() {
        const player = this.player;
        if (player) {
            const playerField = this.getBoardFieldByPosition(player.position);
            if (playerField) {
                const sameFieldPiece = this.pieces.find(piece => {
                    const pieceField = this.getBoardFieldByPosition(piece.position);
                    return pieceField && pieceField.x === playerField.x && pieceField.y === playerField.y
                });
                
                if (sameFieldPiece) {
                    const playerColor = Color.mix(player.fillColor, sameFieldPiece.strokeColor);
                    player.setColor(playerColor, playerColor);
                    this.removePiece(sameFieldPiece);
                }
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
        controls.onKeyDown("ArrowLeft").subscribe(() => {
            if (this.player) {
                this.player.moveLeft(1)
            }
        });
        controls.onKeyDown("ArrowUp").subscribe(() => {
            if (this.player) {
                this.player.moveUp(1)
            }
        });
        controls.onKeyDown("ArrowRight").subscribe(() => {
            if (this.player) {
                this.player.moveRight(1)
            }
        });
        controls.onKeyDown("ArrowDown").subscribe(() => {
            if (this.player) {
                this.player.moveDown(1)
            }
        });
    }
}