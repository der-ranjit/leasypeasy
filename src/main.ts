import { Board } from "./GameParts/Board";
import { Point } from "./Engine/Point";
import { Renderer } from "./Engine/Renderer";
import { Color } from "./Engine/Color";
import { debounce } from "./Utils";
import { Rectangle } from "./Engine/Shapes/Rectangle";
import { Circle } from "./Engine/Shapes/Circle";
import { Controls } from "./Engine/Controls";
import { Square } from "./Engine/Shapes/Square";

const main = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
            const renderer = new Renderer(context);
            const boardRows = 10;
            const boardColumns = 10;
            const boardFieldWidth = 50;
            const boardFieldHeight = 50;
            const boardFieldFillColor = new Color(245, 245, 245);
            const boardFieldStrokeColor = Color.BLACK;
            
            const extraColumns = 7;
            const extraRows = 4;
            const boardWidth = boardFieldWidth * (boardColumns + extraColumns);
            const boardHeight = boardFieldHeight * (boardRows + extraRows);
            const centeredWidth = boardFieldWidth * extraColumns / 2
            const centeredHeight = boardFieldHeight * extraRows / 2

            const boardPosition = new Point(0, 0);

            canvas.width = boardWidth;
            canvas.height = boardHeight;

            const board = new Board(
                boardColumns,
                boardRows,
                boardFieldWidth,
                boardFieldHeight,
                boardPosition,
                boardFieldFillColor,
                boardFieldStrokeColor,
                renderer);
            
            const pieceWidth = board.fieldWidth / 2;
            const playerStartColumn = 2;
            const playerStartRow = 3;
            const player = board.createPlayer(playerStartColumn, playerStartRow, pieceWidth);
            
            setInterval(() => {
                board.addRandomPiece();
                // board.addRow();
                // canvas.height = board.totalHeight;
            }, 200);

            let pointerDown = false;
            canvas.addEventListener("mousedown", _ => pointerDown = true);
            canvas.addEventListener("mouseup", _ => pointerDown = false);
            canvas.addEventListener("click", mouseEvent => debouncedAddFieldPosition(mouseEvent));
            canvas.addEventListener("mousemove", mouseEvent => {
                if (pointerDown) {
                    debouncedAddFieldPosition(mouseEvent);
                } 
            })
            const addFieldAddPosition = (mouseEvent: MouseEvent) => {
                const position = new Point(mouseEvent.clientX, mouseEvent.clientY);
                board.addField(position);
            }
            const debouncedAddFieldPosition = debounce(addFieldAddPosition, 200);
            
            const circle = new Circle(new Point(100, 200), 20, renderer, Color.YELLOW);
            const circle2 = new Square(new Point(200, 100), 20, renderer, Color.YELLOW);
            circle.speed = 5
            circle.isControlled = true;
            window.addEventListener("keydown", (event: KeyboardEvent) => {
                if (event.key === "Enter") {
                    circle.isControlled = !circle.isControlled;
                    circle2.isControlled = !circle2.isControlled;
                }
            })
        }
    }
}

window.onload = () => {
    main();
}
