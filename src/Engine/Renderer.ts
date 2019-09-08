import { GameObject } from "./GameObject";

export namespace Renderer {
    export function draw(context: CanvasRenderingContext2D, drawables: GameObject[], delta: number) {
        context.clearRect(0 , 0, context.canvas.width, context.canvas.height);
        const zIndexSortedRenderObjects =drawables.sort((a, b) => {
            return a.drawConfiguration.zIndex - b.drawConfiguration.zIndex;
        });
        for (const object of zIndexSortedRenderObjects) {
            object.draw(delta);
        }
    }
}