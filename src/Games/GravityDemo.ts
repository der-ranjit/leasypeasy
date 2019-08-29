import { Color, Point, Renderer } from "./../Engine";
import { Circle, Rectangle } from "./../Engine/Shapes";

export const GravityDemo = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gravityRadius = 60;
    const offset = gravityRadius / 2;
    const gravitySource = new Circle(
        new Point(
            canvas.width / 2 - offset,
            canvas.height / 2 - offset
        ),
        gravityRadius,
        renderer
    );

    const circles: Circle[] = [];
    window.addEventListener("click", (event) => {
        const circle = new Circle(
            new Point(event.clientX, event.clientY),
            30,
            renderer,
            Color.CYAN
        );
        circle.gravityEnabled = true;
        circle.gravitationSource = gravitySource;
        circles.push(circle);
    }) 
}