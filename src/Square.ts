import { RenderObject } from "./RenderObject";
import { Renderer } from "./Renderer";

export class Square extends RenderObject {
    constructor (
        public posX: number,
        public posY: number,
        public width: number,
        public color = "black",
        public context: CanvasRenderingContext2D
    ) {
        super();

        const renderer = Renderer.getInstance();
        renderer.addRenderObject(this);
    }

    public update(delta: number) {

    }

    public draw(delta: number) {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.posX, this.posY, this.width, this.width);
    }

}