import { Board } from "./GameParts/Board";
import { Point } from "./Engine/Point";
import { Renderer } from "./Engine/Renderer";
import { Color } from "./Engine/Color";
import { debounce } from "./Utils";
import { Rectangle } from "./Engine/Shapes/Rectangle";
import { Circle } from "./Engine/Shapes/Circle";
import { Controls } from "./Engine/Controls";

const main = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
            canvas.width = 800;
            canvas.height = 600;
            const renderer = new Renderer(context);
            const circle = new Circle(new Point(100, 200), 20, renderer, Color.YELLOW);
            
            const controls = Controls.getInstance();
            controls.onRight(() => {
                circle.move(new Point(50, 0));
                circle.setColor(Color.GREEN);
            })
            controls.onLeft(() => {
                circle.move(new Point(-50, 0));
                circle.setColor(Color.YELLOW);
            })
            controls.onDown(() => {
                circle.move(new Point(0, 50));
                circle.setColor(Color.BLUE);
            })
            controls.onUp(() => {
                circle.move(new Point(0, -50));
                circle.setColor(Color.MAGENTA);
            })
        }
    }
}

window.onload = () => {
    main();
}
