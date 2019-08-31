import { Color, Point, Renderer, Controls, MathUtils } from "./../Engine";
import { Circle, Rectangle } from "./../Engine/Shapes";
import { Vector2D } from "../Engine/Vector2D";

export const GravityDemo = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    
    canvas.width = 1200;
    canvas.height = 800;

    const gravityRadius = 30;
    const offset = gravityRadius / 2;
    const gravitySourceA = new Circle(
        new Point(
            600,
            canvas.height / 2 - offset
        ),
        gravityRadius,
        renderer
    );
    gravitySourceA.mass = 1000;
    const gravitationSources: Circle[] = [];
    gravitationSources.push(gravitySourceA)

    const circles: Circle[] = [];

    let showStats = false;
    let gravityEnabled = true;
    let useGravitationSource = true;
    let isControlled = true;
    let showVelocityIndicator = true;

    const addCircle = (position: Point) => {
        const circle = new Circle(
            position,
            15,
            renderer,
            Color.RANDOM_COLOR
        );
        circle.mass = 150;
        circle.onBoundaryCollision$.subscribe(_ =>  circle.velocity.scale(0.7));
        circle.gravitationSources.push(...gravitationSources, ...circles);
        circles.forEach(_circle => _circle.gravitationSources.push(circle));
        circle.gravityEnabled = gravityEnabled;
        circle.isControlled = isControlled;
        circle.showVelocityIndicator = showVelocityIndicator;
        circle.showStats = showStats;
        circles.push(circle);
    }

    const controls = Controls.getInstance();
    
    window.addEventListener("click", (event) => {
        addCircle(new Point(event.clientX, event.clientY));
    }) 

    controls.onKeyDown(" ").subscribe(_ => {
        for (const circle of circles) {
            circle.velocity.add(new Vector2D(0, -10));
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
    
    controls.onKeyDown("b").subscribe(_ => {
        useGravitationSource = !useGravitationSource
        circles.forEach(circle => {
            if (useGravitationSource) {
                circle.gravitationSources.push(...gravitationSources);
            } else {
                circle.gravitationSources = [];
            }
        });
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
        showVelocityIndicator = !showVelocityIndicator
        circles.forEach(circle => circle.showVelocityIndicator = showVelocityIndicator);
    });
    
    controls.onKeyDown("r").subscribe(_ => {
        circles.forEach(circle => circle.destroy());
        circles.splice(0, circles.length);
    });
}