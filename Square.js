import { RenderObject } from "./RenderObject.js";
import { Renderer } from "./Renderer.js";

export class Square {
    x;
    y;
    width;
    color;
    context;

    constructor(posX, posY, width, color = "black", context) {
        // super();
        this.x = posX;
        this.y = posY;
        this.width = width;
        this.color = color;
        this.context = context;

        const renderer = Renderer.getInstance();
        renderer.addRenderObject(this);
    }

    update(delta) {

    }

    draw(delta) {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, this.width, this.width);
    }

}