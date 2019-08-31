import { Color, Point, Renderer, Controls } from "./../Engine";
import { Circle } from "../Engine/Shapes";

export const Shooter = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    const controls = Controls.getInstance();
    
    canvas.width = 1200;
    canvas.height = 600;

    const lisiPosition = new Point(20, canvas.height / 2);
    const ranzPosition = new Point(canvas.width - 20, canvas.height / 2);
    
    const lisi = new Circle(lisiPosition, 15, renderer, Color.MAGENTA);
    lisi.showVelocityIndicator = true;
    lisi.isControlled = true;
    lisi.gravityEnabled = true;
    lisi.up = "w";
    lisi.down = "s";
    lisi.left = "a";
    lisi.right = "d";
    
    const ranz = new Circle(ranzPosition, 15, renderer);
    ranz.showVelocityIndicator = true;
    ranz.isControlled = true;
    ranz.gravityEnabled = true;

    lisi.gravitationSources.push(ranz);
    ranz.gravitationSources.push(lisi);




    controls.onKeyDown(" ").subscribe(_ => {
    });

    controls.onKeyDown("p").subscribe(_ => {
        renderer.isRunning ? renderer.pause() : renderer.unpause();
    });;

}