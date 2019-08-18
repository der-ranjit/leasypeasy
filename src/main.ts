import { Board } from "./GameParts/Board";
import { Point } from "./Engine/Point";
import { Renderer } from "./Engine/Renderer";
import { Color } from "./Engine/Color";
import { debounce } from "./Utils";
import { Rectangle } from "./Engine/Shapes/Rectangle";
import { Circle } from "./Engine/Shapes/Circle";
import { Controls } from "./Engine/Controls";
import { Square } from "./Engine/Shapes/Square";

const main = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
            canvas.width = 800;
            canvas.height = 600;
            const renderer = new Renderer(context);
            const circle = new Circle(new Point(100, 200), 20, renderer, Color.YELLOW);
            const circle2 = new Square(new Point(200, 100), 20, renderer, Color.YELLOW);
            circle.speed = 5
            circle.isControlled = true;
            window.addEventListener("keydown", (event: KeyboardEvent) => {
                if (event.key === "Enter") {
                    circle.isControlled = !circle.isControlled;
                    circle2.isControlled = !circle2.isControlled;
                }
            })

        }
    }
}

window.onload = () => {
    main();
}
