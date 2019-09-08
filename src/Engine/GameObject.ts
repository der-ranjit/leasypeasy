import { Color, Common } from "./utils";
import { MainLoop } from "./MainLoop";

export interface DrawConfiguration {
    fillColor: Color;
    strokeColor: Color;
    lineWidth: number;
}

export abstract class GameObject {
    /* unique id for the GameObject */
    public readonly id: string;
    /* controls if the object is drawn */
    public drawn = true;
    public zIndex = 1;
    
    public checkBoundaries = true;
    public collisionObjects: GameObject[] = [];

    constructor(
        protected mainLoop: MainLoop,
        protected drawConfiguration: DrawConfiguration
    ) {
        this.mainLoop.addGameObject(this);
        this.id = Common.createUniqueId();
    }

    public abstract update(delta: number): void;
    public abstract draw(delta: number): void; 

    protected get context() {
        return this.mainLoop.context;
    } 

    public setColor(fillAndStrokeColor: Color): void;
    public setColor(fillColor: Color, strokeColor: Color): void;
    public setColor(fillColor: Color, strokeColor?: Color) {
        let stroke = fillColor;
        if (strokeColor) {
            stroke = strokeColor;
        } 
        this.drawConfiguration.fillColor = fillColor;
        this.drawConfiguration.strokeColor = stroke; 
    }

    public destroy() {
        this.mainLoop.removeGameObject(this);
    }
}