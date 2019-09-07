import { Renderer } from "./Renderer";
import { Color } from "./utils";

export abstract class RenderObject {
    public shouldBeDrawn = true;
    public zIndex = 1;

    constructor(
        protected renderer: Renderer,
        protected fillColor: Color,
        protected strokeColor: Color,
        protected lineWidth: number
    ) {
        this.renderer.addRenderObject(this);
    }

    public abstract update(delta: number): void;
    public abstract draw(delta: number): void; 

    protected get context() {
        return this.renderer.context;
    } 

    public setColor(fillAndStrokeColor: Color): void;
    public setColor(fillColor: Color, strokeColor: Color): void;
    public setColor(fillColor: Color, strokeColor?: Color) {
        let stroke = fillColor;
        if (strokeColor) {
            stroke = strokeColor;
        } 
        this.fillColor = fillColor;
        this.strokeColor = stroke; 
    }

    public destroy() {
        this.renderer.removeRenderObject(this);
    }
}