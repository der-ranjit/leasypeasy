import { Renderer } from "../../Engine/Renderer";
import { Circle } from "../../Engine/Shapes/Circle";
import { Point } from "../../Engine/Point";
import { Color } from "../../Engine/Color";

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

    // checkForCollision()
    // Algorithmus zur Kollisionerkennung zweier Kreise: 
    // Sei d der Abstand zwischen den Mittelpunkten zweier Kreise A und B und r die Summe der Radiuse r(A) und r(B)
    // dann kollidieren die Kreise, wenn gilt:
    // d <= r

    // Input: 2 Kreise 
    // Output: boolean

    /**
     *  Implementatation
     * 
     * */
    window.addEventListener(Renderer.RENDER_LOOP_END_EVENT, () => {
        const isColliding = checkForCollision(circle, circle2);
        if (isColliding) {
            circle.setColor(Color.RED);
            circle2.setColor(Color.RED);
        }
        else {
            circle.setColor(Color.YELLOW);
            circle2.setColor(Color.YELLOW);
        }
    })

    const checkForCollision = (circleA: Circle, circleB: Circle) => {
        const distance = getDistanceBetween(circleA.position, circleB.position);
        const radii = circleA.radius + circleB.radius;
        const isColliding = distance <= radii;

        return isColliding;
    }

    const getDistanceBetween = (pointA: Point, pointB: Point) => {
        const a = Math.abs(pointB.x - pointA.x);
        const b = Math.abs(pointB.y - pointA.y);
        const distance = Math.sqrt((a * a) + (b * b));
        return distance;
    }

}