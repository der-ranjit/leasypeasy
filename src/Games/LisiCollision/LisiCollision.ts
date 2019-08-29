import { Collision, Color, Controls, Point, Renderer } from "../../Engine";
import { Circle, Rectangle } from "../../Engine/Shapes";


export const LisiCollision = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    
    canvas.width = 800;
    canvas.height = 650;

    const midCircle = new Circle(new Point(370, 295), 60, renderer);

    const circlesColor = Color.YELLOW;
    const circle1 = new Circle(new Point(100, 100), 50, renderer, circlesColor);
    circle1.speed = 5
    circle1.isControlled = true;
    const circle2 = new Circle(new Point(300, 100), 50, renderer, circlesColor);
    circle1.gravitationSource = midCircle;

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

    const controls = Controls.getInstance();
    controls.onKeyDown(" ").subscribe(() => {
        controllables[controlledIndex].gravityEnabled = !controllables[controlledIndex].gravityEnabled;
        // controllables[controlledIndex].velocity.multiply(5);
    });

    controls.onKeyDown("Enter").subscribe(() => {
        controlledIndex = (controlledIndex + 1) % controllables.length;
        controllables.forEach(contrallable => contrallable.isControlled = false);
        controllables[controlledIndex].isControlled = true;
    });

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