import { MainLoop, DrawConfiguration } from "../../Engine";
import { Color, Controls } from "../../Engine/utils";
import { Circle, Rectangle, Point, Shape, Vector2D } from "../../Engine/Geometry";


export const LisiCollision = (mainLoop: MainLoop) => {
    const canvas = mainLoop.context.canvas;
    const controls = Controls.getInstance();

    canvas.width = 800;
    canvas.height = 650;

    const vectorLeft = new Vector2D(-3, 0);
    const vectorRight = new Vector2D(3, 0);
    const vectorUp = new Vector2D(0, -3);
    const vectorDown = new Vector2D(0, 3);
    const shapeControls = (shape: Shape) => {
        if (shape === controllables[controlledIndex]) {
            if (controls.isKeyPressed("ArrowLeft")) {
                shape.move(vectorLeft)
            }
            if (controls.isKeyPressed("ArrowUp")) {
                shape.move(vectorUp)
            }
            if (controls.isKeyPressed("ArrowRight")) {
                shape.move(vectorRight)
            }
            if (controls.isKeyPressed("ArrowDown")) {
                shape.move(vectorDown)
            }
        }
    }

    const circlesColor = Color.YELLOW;
    const circle1 = new Circle(new Point(100, 100), 50, mainLoop, new DrawConfiguration(
        circlesColor,
        circlesColor
    ));
    circle1.controls = () => shapeControls(circle1);
    const circle2 = new Circle(new Point(300, 100), 50, mainLoop, new DrawConfiguration(
        circlesColor,
        circlesColor
    ));
    
    const rectsColor = Color.GREEN;
    const rect1 = new Rectangle(new Point(50, 300), 100, 50, mainLoop, new DrawConfiguration(
        rectsColor,
        rectsColor
    ));
    rect1.controls = () => shapeControls(rect1);
    const rect2 = new Rectangle(new Point(200, 300), 100, 50, mainLoop, new DrawConfiguration(
        rectsColor,
        rectsColor
    ));
    
    const circleRectColor = Color.MAGENTA;
    const circle3 = new Circle(new Point(100, 500), 50, mainLoop, new DrawConfiguration(
        circleRectColor,
        circleRectColor
    ));
    circle3.controls = () => shapeControls(circle3);
    const rect3 = new Rectangle(new Point(250, 500), 100, 50, mainLoop, new DrawConfiguration(
        circleRectColor,
        circleRectColor
    ));

    const controllables = [circle1, rect1, circle3];
    let controlledIndex = 0;

    controls.onKeyDown("Enter").subscribe(() => {
        controlledIndex = (controlledIndex + 1) % controllables.length;
    });

}