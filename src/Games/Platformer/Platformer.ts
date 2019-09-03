import { Renderer, Controls, Point, Color } from "../../Engine";
import { PlayerControls, Player } from "../Shooter/Player";

export const Platformer = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    const controls = Controls.getInstance();
    
    canvas.width = 1200;
    canvas.height = 600;

    const lisiPosition = new Point(20, canvas.height / 2);
    const lisiControls: PlayerControls = {
        left: "a",
        up: "w",
        right: "d",
        down: "s",
        shoot: "q"
    };
    const ranzPosition = new Point(canvas.width - 20, canvas.height / 2);

    const ranz = new Player("Ranz", ranzPosition, Color.BLACK, Color.RED, renderer);
    ranz.circle.gravityEnabled = true;
}