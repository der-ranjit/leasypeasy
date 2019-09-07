import { Renderer } from "../../Engine";
import { Color } from "../../Engine/utils";
import { Point } from "../../Engine/Geometry";
import { debounce } from "../../Utils";
import { Board } from "./Board";

export const LisiColors = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;

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
}
