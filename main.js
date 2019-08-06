import { Board } from "./Board.js";
import { Controls } from "./Controls.js";
import { executeRandomly } from "./Utils.js";

function main() {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");
    const boardRows = 5;
    const boardColumns = 5;
    const boardFieldWidth = 50;

    const board = new Board(boardColumns, boardRows, boardFieldWidth, context);
    canvas.width = board.totalWidth;
    canvas.height = board.totalHeight;
    
    const playerStartColumn = 2;
    const playerStartRow = 3;
    const playerWidth = 15;
    const player = board.createPiece(playerStartColumn, playerStartRow, playerWidth);

    const controls = Controls.getInstance();
    controls.onLeft(() => board.movePieceLeft(player));
    controls.onUp(() => board.movePieceUp(player));
    controls.onRight(() => board.movePieceRight(player));
    controls.onDown(() => board.movePieceDown(player));
    
    const movementFunctions = [
        () => board.movePieceLeft(player),
        () => board.movePieceUp(player),
        () => board.movePieceRight(player),
        () => board.movePieceDown(player),
    ]

    setInterval(() => {
        executeRandomly(movementFunctions);
    }, 100)
}

window.onload = () => {
    main();
}











