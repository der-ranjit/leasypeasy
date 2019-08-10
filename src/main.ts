import { Board } from "./GameParts/Board";
import { randomInt } from "./Utils";
import { Point } from "./Engine/Point";

const main = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
            const boardRows = 18;
            const boardColumns = 18;
            const boardFieldWidth = 35;
            const boardPosition = new Point(0, 0);
            
            const board = new Board(boardColumns, boardRows, boardFieldWidth, boardPosition, context);
            canvas.width = board.totalWidth;
            canvas.height = board.totalHeight;
            
            const pieceWidth = board.fieldWidth / 2;
            const playerStartColumn = 2;
            const playerStartRow = 3;
            const player = board.createPlayer(playerStartColumn, playerStartRow, pieceWidth);
            
            const colors = ["red", "green", "yellow", "blue"];
            const addRandomPiece = () => {
                const randomColor = colors[randomInt(0, colors.length)];
                const randomColumn = randomInt(0, board.columns);
                const randomRow = randomInt(0, board.rows);
                if (board.isFieldEmpty(randomColumn, randomRow)) {
                    board.addPiece(randomColumn, randomRow, pieceWidth, randomColor);
                }
            }
            setInterval(() => {
                addRandomPiece();
            }, 2000);
        }
    }
}

window.onload = () => {
    main();
}











