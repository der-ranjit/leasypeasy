import { Renderer } from "./Renderer";

export abstract class RenderObject {
    public shouldBeDrawn = true;

    protected renderer: Renderer;

    constructor() {
        this.renderer = Renderer.getInstance();
        this.renderer.addRenderObject(this);
    }

    public abstract update(delta: number): void;
    public abstract draw(delta: number): void; 

    public removeFromRenderer() {
        this.renderer.removeRenderObject(this);
    }
}