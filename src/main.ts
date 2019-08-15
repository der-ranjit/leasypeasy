import { Board } from "./GameParts/Board";
import { Point } from "./Engine/Point";
import { Renderer } from "./Engine/Renderer";
import { Color } from "./Engine/Color";

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
            const boardPosition = new Point(0, 0);
            const boardFieldFillColor = new Color(245, 245, 245);
            const boardFieldStrokeColor = Color.BLACK;
            
            const board = new Board(
                boardColumns,
                boardRows,
                boardFieldWidth,
                boardFieldHeight,
                boardPosition,
                boardFieldFillColor,
                boardFieldStrokeColor,
                renderer);
            canvas.width = board.totalWidth + 200;
            canvas.height = board.totalHeight;
            
            const pieceWidth = board.fieldWidth / 2;
            const playerStartColumn = 2;
            const playerStartRow = 3;
            const player = board.createPlayer(playerStartColumn, playerStartRow, pieceWidth);
            
            setInterval(() => {
                board.addRandomPiece();
                // board.addRow();
                // canvas.height = board.totalHeight;
            }, 1500);

            canvas.addEventListener("click", mouseEvent => {
                const position = new Point(mouseEvent.clientX, mouseEvent.clientY);
                board.addField(position);
            })
        }
    }
}

window.onload = () => {
    main();
}
