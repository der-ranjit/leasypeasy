import { RenderObject } from "./RenderObject";

export class Square extends RenderObject {
    constructor (
        public posX: number,
        public posY: number,
        public width: number,
        public color = "black",
        public context: CanvasRenderingContext2D
    ) {
        super();
    }

    public update(delta: number) {

    }

    public draw(delta: number) {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.posX, this.posY, this.width, this.width);
    }

}