import { Board } from "./GameParts/Board";
import { executeRandomly } from "./Utils";

const main = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
            const boardRows = 5;
            const boardColumns = 5;
            const boardFieldWidth = 50;
        
            const board = new Board(boardColumns, boardRows, boardFieldWidth, context);
            canvas.width = board.totalWidth;
            canvas.height = board.totalHeight;
            
            const playerStartColumn = 2;
            const playerStartRow = 3;
            const playerWidth = 15;
            const player = board.createPlayer(playerStartColumn, playerStartRow, playerWidth);

            const playerMoveDistance = board.fieldWidth;
            const movementFunctions = [
                () => player.moveLeft(playerMoveDistance),
                () => player.moveUp(playerMoveDistance),
                () => player.moveRight(playerMoveDistance),
                () => player.moveDown(playerMoveDistance),
            ]
        
            setInterval(() => {
                // executeRandomly(movementFunctions);
            }, 100)
        }
    }
}

window.onload = () => {
    main();
}











