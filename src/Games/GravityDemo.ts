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

    let showStats = false;
    let gravityEnabled = false;
    let isControlled = true;
    let showDirectionIndicator = true;

    const addCircle = (position: Point) => {
        const circle = new Circle(
            position,
            15,
            renderer,
            Color.RANDOM_COLOR
        );
        circle.gravitationSource = gravitySource;
        circle.gravityEnabled = gravityEnabled;
        circle.isControlled = isControlled;
        circle.showDirectionIndicator = showDirectionIndicator;
        circle.showStats = showStats;
        circles.push(circle);
    }

    const controls = Controls.getInstance();
    
    window.addEventListener("click", (event) => {
        addCircle(new Point(event.clientX, event.clientY));
    }) 

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

    controls.onKeyDown("a").subscribe(_ => {
        const randomX = MathUtils.randomInt(20, renderer.context.canvas.width - 20);
        const randomY = MathUtils.randomInt(20, renderer.context.canvas.height - 20);
        addCircle(new Point(randomX, randomY));
    });

    controls.onKeyDown("i").subscribe(_ => {
        showStats = !showStats;
        circles.forEach(circle => circle.showStats = showStats);
    });

    controls.onKeyDown("g").subscribe(_ => {
        gravityEnabled = !gravityEnabled;
        circles.forEach(circle => circle.gravityEnabled = gravityEnabled);
    });
    
    controls.onKeyDown("c").subscribe(_ => {
        isControlled = !isControlled
        circles.forEach(circle => circle.isControlled = isControlled);
    });
    
    controls.onKeyDown("d").subscribe(_ => {
        showDirectionIndicator = !showDirectionIndicator
        circles.forEach(circle => circle.showDirectionIndicator = showDirectionIndicator);
    });
    
    controls.onKeyDown("r").subscribe(_ => {
        circles.forEach(circle => circle.destroy());
        circles.splice(0, circles.length);
    });
}