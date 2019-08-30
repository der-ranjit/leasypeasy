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
        circle.gravitationSource = gravitySource;
        circle.gravityEnabled = true;
        circle.isControlled = true;
        circle.showDirectionIndicator = circle.isControlled;
        circle.showStats = circle.isControlled;
        circles.push(circle);
    }) 

    const controls = Controls.getInstance();

    controls.onKeyDown(" ").subscribe(_ => {
        for (const circle of circles) {
            const velocity = Vector2D.directional(gravitySource.position, circle.position).normalize();
            circle.velocity = velocity;
            circle.speed += 5;
            circle.frictionFactor = 0.99;
        }
    });

    controls.onKeyDown("p").subscribe(_ => {
        renderer.isRunning ? renderer.pause() : renderer.unpause();
    });

    controls.onKeyDown("i").subscribe(_ => {
        circles.forEach(circle => circle.showStats = !circle.showStats);
    });

    controls.onKeyDown("g").subscribe(_ => {
        circles.forEach(circle => circle.gravityEnabled = !circle.gravityEnabled);
    });
    
    controls.onKeyDown("c").subscribe(_ => {
        circles.forEach(circle => circle.isControlled = !circle.isControlled);
    });
    
    controls.onKeyDown("d").subscribe(_ => {
        circles.forEach(circle => circle.showDirectionIndicator = !circle.showDirectionIndicator);
    });
}