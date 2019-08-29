import { Color, Point, Renderer, Controls, MathUtils } from "./../Engine";
import { Circle, Rectangle } from "./../Engine/Shapes";

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
        circle.checkBoundary = false,
        circle.gravityEnabled = true;
        circle.gravitationSource = gravitySource;
        circles.push(circle);
    }) 

    const controls = Controls.getInstance();
    controls.onKeyDown(" ").subscribe(_ => {
        const minVel = -15;
        const maxVel = 15;
        for (const circle of circles) {
            // const velocity = new Point(
            //     MathUtils.randomInt(minVel, maxVel),
            //     MathUtils.randomInt(minVel, maxVel)
            // );
            // circle.velocity = velocity;
            circle.velocity.x = -circle.velocity.x;
            circle.velocity.y = -circle.velocity.y;
            circle.acceleration = 0.99;
            circle.speed = MathUtils.randomInt(1, 1.1);
        }
    });
}