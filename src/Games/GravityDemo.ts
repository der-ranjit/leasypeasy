import { Color, Point, Renderer, Controls, MathUtils } from "./../Engine";
import { Circle, Rectangle } from "./../Engine/Shapes";

export const GravityDemo = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    
    canvas.width = 1024;
    canvas.height = 600;

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

    const controls = Controls.getInstance();
    controls.onKeyDown(" ").subscribe(_ => {
        const minVel = -30;
        const maxVel = 30;
        for (const cirlce of circles) {
            const velocity = new Point(
                MathUtils.randomInt(minVel, maxVel),
                MathUtils.randomInt(minVel, maxVel)
            );
            cirlce.velocity = velocity;
        }
    });
}