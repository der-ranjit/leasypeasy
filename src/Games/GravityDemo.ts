import { Color, Point, Renderer, Controls, MathUtils } from "./../Engine";
import { Circle, Rectangle } from "./../Engine/Shapes";
import { Vector2D } from "../Engine/Vector2D";

export const GravityDemo = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    
    canvas.width = 1024;
    canvas.height = 600;

    const gravityRadius = 30;
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
            15,
            renderer,
            Color.RANDOM_COLOR
        );
        circle.gravityEnabled = true;
        circle.gravitationSource = gravitySource;
        circle.isControlled = true;
        circle.showDirectionIndicator = circle.isControlled;
        circle.showStats = circle.isControlled;
        circles.push(circle);
    }) 

    const controls = Controls.getInstance();

    controls.onKeyDown(" ").subscribe(_ => {
        for (const circle of circles) {
            const direction = Vector2D.directional(gravitySource.position, circle.position).normalize();
            circle.direction = direction;
            circle.speed += 5;
            circle.acceleration = 0.99;
        }
    });
}