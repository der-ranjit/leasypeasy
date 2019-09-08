import { Point } from "../Point";
import { Rectangle } from "./Rectangle";
import { MainLoop } from "../../MainLoop";
import { DrawConfiguration } from "../../GameObject";

export class Square extends Rectangle {
    constructor (
        position: Point,
        public width: number,
        mainLoop: MainLoop,
        drawConfiguration: DrawConfiguration
    ) {
        super(position, width, width, mainLoop, drawConfiguration);
    }
}