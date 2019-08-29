import { Color, MathUtils, Point, Renderer } from "../../Engine";
import { Circle, Square } from "../../Engine/Shapes";
// TODO remove shapeType?
import { Shape, ShapeType } from "../../Engine/Shapes/Shape.abstract";

import { Board } from "./Board";

export class ShapedPiece {
    private shape!: Shape;
    private changeColorIntervalID: number | null = null;

    public get position() {
        return this.shape.position;
    } 

    constructor(
        renderer: Renderer,
        private ownerBoard: Board,
        private boardField: Point,
        public width: number,
        public fillColor: Color,
        public strokeColor: Color,
        public lineWidth = 1,
        public shapeType: ShapeType,
        zIndex = 1
    ) {
        if (shapeType === Circle) {
            const radius = this.width / 2;
            this.shape = new Circle(boardField, radius, renderer, fillColor, strokeColor, lineWidth);
        }
        if (shapeType === Square) {
            this.shape = new Square(boardField, width, renderer, fillColor, strokeColor, lineWidth)
        }
        
        if (this.shape) {
            this.shape.zIndex = zIndex;
            this.shape.centerArountPoint(boardField);
        }
    }

    public destroy() {
        this.stopRandomColorChange();
        this.shape.destroy();
    }

    public startRandomColorChange(colors: Color[], intervalMS = 500) {
        this.stopRandomColorChange();
        this.changeColorIntervalID = <any>setInterval(() => {
            this.changeToRandomColor(colors);
        }, intervalMS)
    }
    
    public stopRandomColorChange() {
        if (this.changeColorIntervalID) {
            clearInterval(this.changeColorIntervalID);
        }
    }

    public changeToRandomColor(colors: Color[]) {
        const randomColor = colors[MathUtils.randomInt(0, colors.length)];
        this.setColor(Color.WHITE, randomColor);
    }

    public moveRight(fields: number) {
        const fieldCoords = this.ownerBoard.getBoardFieldByPosition(this.boardField);
        if (fieldCoords) {
            let column = fieldCoords.x + fields;
            let row = fieldCoords.y
            const field = this.ownerBoard.existsField(column, row);
            if (field) {
                this.boardField = this.ownerBoard.getCenterOfField(column, row);
                this.shape.centerArountPoint(this.boardField);
            }
        }
    }
    
    public moveLeft(fields: number) {
        const fieldCoords = this.ownerBoard.getBoardFieldByPosition(this.boardField);
        if (fieldCoords) {
            let column = fieldCoords.x - fields;
            let row = fieldCoords.y
            const field = this.ownerBoard.existsField(column, row);
            if (field) {
                this.boardField = this.ownerBoard.getCenterOfField(column, row);
                this.shape.centerArountPoint(this.boardField);
            }
        }
    }

    public moveUp(fields: number) {
        const fieldCoords = this.ownerBoard.getBoardFieldByPosition(this.boardField);
        if (fieldCoords) {
            let column = fieldCoords.x;
            let row = fieldCoords.y - fields;
            const field = this.ownerBoard.existsField(column, row);
            if (field) {
                this.boardField = this.ownerBoard.getCenterOfField(column, row);
                this.shape.centerArountPoint(this.boardField);
            }
        }
    }

    public moveDown(fields: number) {
        const fieldCoords = this.ownerBoard.getBoardFieldByPosition(this.boardField);
        if (fieldCoords) {
            let column = fieldCoords.x;
            let row = fieldCoords.y + fields;
            const field = this.ownerBoard.existsField(column, row);
            if (field) {
                this.boardField = this.ownerBoard.getCenterOfField(column, row);
                this.shape.centerArountPoint(this.boardField);
            }
        }
    }

    public setColor(fill: Color, stroke: Color) {
        this.fillColor = fill;
        this.strokeColor = stroke;
        this.shape.setColor(fill, stroke);
    }
}