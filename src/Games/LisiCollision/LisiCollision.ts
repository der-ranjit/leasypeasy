import { Renderer } from "../../Engine/Renderer";
import { Circle } from "../../Engine/Shapes/Circle";
import { Point } from "../../Engine/Point";
import { Color } from "../../Engine/Color";
import { Collision } from "../../Engine/Collision";
import { Rectangle } from "../../Engine/Shapes/Rectangle";

export const LisiCollision = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    
    canvas.width = 800;
    canvas.height = 650;

    const circlesColor = Color.YELLOW;
    const circle1 = new Circle(new Point(100, 100), 50, renderer, circlesColor);
    circle1.speed = 5
    circle1.isControlled = true;
    const circle2 = new Circle(new Point(300, 100), 50, renderer, circlesColor);

    const rectsColor = Color.GREEN;
    const rect1 = new Rectangle(new Point(50, 300), 100, 50, renderer, rectsColor);
    rect1.speed = 5;
    const rect2 = new Rectangle(new Point(200, 300), 100, 50, renderer, rectsColor);

    const circleRectColor = Color.MAGENTA;
    const circle3 = new Circle(new Point(100, 500), 50, renderer, circleRectColor);
    circle3.speed = 5
    const rect3 = new Rectangle(new Point(250, 500), 100, 50, renderer, circleRectColor);

    let controlledIndex = 0;
    const controllables = [circle1, rect1, circle3];

    window.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            controlledIndex = (controlledIndex + 1) % controllables.length;
            controllables.forEach(contrallable => contrallable.isControlled = false);
            controllables[controlledIndex].isControlled = true;
        }
    })

    const collisionColor = Color.RED;
    Renderer.onLoopEnd$.subscribe(() => {
        const isCollidingCircles = Collision.isColliding(circle1, circle2);
        let color = isCollidingCircles ? collisionColor : circlesColor;
        circle1.setColor(color, Color.BLACK);
        circle2.setColor(color, Color.BLACK);
        
        const isCollidingRectangles = Collision.isColliding(rect1, rect2);
        color = isCollidingRectangles ? collisionColor : rectsColor;
        rect1.setColor(color, Color.BLACK);
        rect2.setColor(color, Color.BLACK);
        
        const isCollidingCircleRectangle = Collision.isColliding(circle3, rect3);
        color = isCollidingCircleRectangle ? collisionColor : circleRectColor;
        circle3.setColor(color, Color.BLACK);
        rect3.setColor(color, Color.BLACK);
    });
}