import { Subject } from "rxjs";
import { Color } from "../../utils";
import { Point } from "../Point";
import { Circle } from "./Circle";
import { Square } from "./Square";
import { Rectangle } from "./Rectangle";
import { MainLoop } from "../../MainLoop";
import { GameObject, DrawConfiguration } from "../../GameObject";
import { BoundaryCollision } from "../../Collision";

export type ShapeType = typeof Circle | typeof Square | typeof Rectangle;

export abstract class Shape extends GameObject {
    public onBoundaryCollision$ = new Subject<BoundaryCollision>();
    public controls: null | (() => void) = null;
    
    private creationFill: Color;
    private creationStroke: Color;

    constructor(
        position: Point,
        mainLoop: MainLoop,
        drawConfiguration: DrawConfiguration
    ) {
        super(mainLoop, drawConfiguration, position);
        this.creationFill = drawConfiguration.fillColor; 
        this.creationStroke = drawConfiguration.strokeColor; 
    }


    public abstract centerArountPoint(point: Point): void;
    protected abstract drawShape(delta: number): void;
    protected abstract updateShape(delta: number): void;

    public update(delta: number) {
        if (this.controls && typeof this.controls === "function") {
            this.controls();
        }
        this.updateShape(delta);
    }

    public draw(delta: number) {
        if (this.collision.indicateCollision) {
            if (this.collision.collisions.length > 0) {
                this.setColor(Color.RED);
            } else {
                this.setColor(this.creationFill, this.creationStroke);
            }
        }
        this.drawShape(delta);
    }
}