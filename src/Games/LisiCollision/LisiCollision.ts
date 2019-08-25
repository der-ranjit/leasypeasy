import { Renderer } from "../../Engine/Renderer";
import { Circle } from "../../Engine/Shapes/Circle";
import { Point } from "../../Engine/Point";
import { Color } from "../../Engine/Color";
import { Collision } from "../../Engine/Collision";

export const LisiCollision = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    
    canvas.width = 800;
    canvas.height = 500;

    const circle = new Circle(new Point(100, 200), 20, renderer, Color.YELLOW);
    const circle2 = new Circle(new Point(200, 100), 20, renderer, Color.YELLOW);

    circle.speed = 5
    circle.isControlled = true;

    window.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            circle.isControlled = !circle.isControlled;
            circle2.isControlled = !circle2.isControlled;
        }
    })

    Renderer.onLoopEnd$.subscribe(() => {
        const isColliding = Collision.isColliding(circle, circle2);
        if (isColliding) {
            circle.setColor(Color.RED);
            circle2.setColor(Color.RED);
        }
        else {
            circle.setColor(Color.YELLOW);
            circle2.setColor(Color.YELLOW);
        }
    });
}