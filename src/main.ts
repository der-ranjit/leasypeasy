import { Board } from "./GameParts/Board";
import { Point } from "./Engine/Point";
import { Renderer } from "./Engine/Renderer";

const main = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
            const renderer = new Renderer(context);
            const boardRows = 18;
            const boardColumns = 18;
            const boardFieldWidth = 35;
            const boardPosition = new Point(0, 0);
            
            const board = new Board(boardColumns, boardRows, boardFieldWidth, boardPosition, renderer);
            canvas.width = board.totalWidth;
            canvas.height = board.totalHeight;
            
            const pieceWidth = board.fieldWidth / 2;
            const playerStartColumn = 2;
            const playerStartRow = 3;
            const player = board.createPlayer(playerStartColumn, playerStartRow, pieceWidth);
            
            setInterval(() => {
                board.addRandomPiece();
            }, 2000);
        }
    }
}

window.onload = () => {
    main();
}
