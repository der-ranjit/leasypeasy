export abstract class RenderObject {
    public shouldBeDrawn = true;

    public abstract update(delta: number): void;
    public abstract draw(delta: number): void; 
}