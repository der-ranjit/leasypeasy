import { Point } from "./Point";
import { Shape } from "./Shapes/Shape.abstract";
import { Circle } from "./Shapes/Circle";
import { Rectangle } from "./Shapes/Rectangle";

export namespace Collision {
    export function isColliding(shapeA: Shape, shapeB: Shape) {
        if (shapeA instanceof Circle && shapeB instanceof Circle) {
            return decideCircleCollision(shapeA, shapeB);
        }

        if (shapeA instanceof Rectangle && shapeB instanceof Rectangle) {
            return decideRectangleCollision(shapeA, shapeB);
        }

        if (shapeA instanceof Rectangle && shapeB instanceof Circle ) {
            return decideCircleRectangleCollision(shapeB, shapeA);
        } else if (shapeA instanceof Circle && shapeB instanceof Rectangle ) {
            return decideCircleRectangleCollision(shapeA, shapeB);
        }
    }


    /**
     *  Algorithmus zur Kollisionerkennung zweier Kreise: 
     *  Sei d der Abstand zwischen den Mittelpunkten zweier Kreise A und B und r die Summe der Radiuse r(A) und r(B)
     *  dann kollidieren die Kreise, wenn gilt:
     *  d <= r
     */
    function decideCircleCollision(circleA: Circle, circleB: Circle): boolean {
        const distance = Point.distanceBetween(circleA.position, circleB.position);
        const radii = circleA.radius + circleB.radius;
        const isColliding = distance <= radii;

        return isColliding;
    }

    function decideRectangleCollision(rectA: Rectangle, rectB: Rectangle): boolean {
        if ((rectA.position.y === rectB.position.y && 
            rectA.position.x + rectA.width >= rectB.position.x &&
            rectA.position.x <= rectB.position.x)
            || rectA.position.x === rectB.position.x) {
            return true;
        }
        const bx = rectB.position.x;
        const by = rectB.position.y;
        const ax = rectA.position.x;
        const ay = rectA.position.y;
        if ( (ax <= bx &&
            ay <= by) ||
            (ax >= bx &&
            ay >= by) 
        ) {
            return true;
        }
        return false;
    }
    
    function decideCircleRectangleCollision(circle: Circle, rect: Rectangle): boolean {
        return false;
    }
}