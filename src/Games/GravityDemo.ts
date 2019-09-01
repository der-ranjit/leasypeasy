import { Color, Point, Renderer, Controls, MathUtils } from "./../Engine";
import { Circle, Rectangle } from "./../Engine/Shapes";
import { Vector2D } from "../Engine/Vector2D";

export const GravityDemo = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    const controls = Controls.getInstance();

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
    let showVelocityIndicator = true;

    const circleControls = (circle: Circle) => {
        const left = "ArrowLeft",
            up = "ArrowUp",
            right = "ArrowRight",
            down = "ArrowDown";
        const currentLength = circle.velocity.getLength();
        if (controls.isKeyPressed(left)) {
            circle.velocity.rotate(-4);;
        }
        if (controls.isKeyPressed(right)) {
            circle.velocity.rotate(4);
        }
        if (controls.isKeyPressed(down)) {
            const deccelerate = 0.2;
            let newLength = currentLength - deccelerate;
            newLength = (newLength < 0) ? 0 : newLength;
            circle.velocity.setLength(newLength);
        }
        if (controls.isKeyPressed(up)) {
            const accelerate = 0.1;
            const maxSpeed = 5;
            let newLength = currentLength + accelerate;
            newLength = (newLength > maxSpeed) ? maxSpeed : newLength;
            circle.velocity.setLength(newLength);
        }
        // circle.speed = circle.speed * circle.frictionFactor;
        // if (Math.abs(circle.speed) <= 0.1) {
        //     circle.speed = 0;
        // }
    }

    const addCircle = (position: Point) => {
        const circle = new Circle(
            position,
            15,
            renderer,
            Color.RANDOM_COLOR
        );
        circle.controls = () => circleControls(circle);
        circle.mass = 150;
        circle.onBoundaryCollision$.subscribe(_ =>  circle.velocity.scale(0.7));
        circle.gravitationSources.push(...gravitationSources, ...circles);
        circles.forEach(_circle => _circle.gravitationSources.push(circle));
        circle.gravityEnabled = gravityEnabled;
        circle.showVelocityIndicator = showVelocityIndicator;
        circle.showStats = showStats;
        circles.push(circle);
    }
    
    window.addEventListener("click", (event) => {
        addCircle(new Point(event.clientX, event.clientY));
    }) 

    controls.onKeyDown(" ").subscribe(_ => {
        for (const circle of circles) {
            circle.velocity.add(new Vector2D(0, -10));
        }
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
    
    controls.onKeyDown("d").subscribe(_ => {
        showVelocityIndicator = !showVelocityIndicator
        circles.forEach(circle => circle.showVelocityIndicator = showVelocityIndicator);
    });
    
    controls.onKeyDown("r").subscribe(_ => {
        circles.forEach(circle => circle.destroy());
        circles.splice(0, circles.length);
    });
}