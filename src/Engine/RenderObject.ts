import { Renderer } from "./Renderer";

export abstract class RenderObject {
    public shouldBeDrawn = true;

    constructor(protected renderer: Renderer) {
        this.renderer.addRenderObject(this);
    }

    public abstract update(delta: number): void;
    public abstract draw(delta: number): void; 

    public removeFromRenderer() {
        this.renderer.removeRenderObject(this);
    }
}