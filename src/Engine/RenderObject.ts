import { Renderer } from "./Renderer";

export abstract class RenderObject {
    public shouldBeDrawn = true;

    constructor() {
        const renderer = Renderer.getInstance();
        renderer.addRenderObject(this);
    }

    public abstract update(delta: number): void;
    public abstract draw(delta: number): void; 
}