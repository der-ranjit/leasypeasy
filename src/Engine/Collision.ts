import { Shape } from "./Shapes/Shape";
import { Circle } from "./Shapes/Circle";
import { Point } from "./Point";
import { Rectangle } from "./Shapes/Rectangle";

export class Collision {
    public static isColliding(shapeA: Shape, shapeB: Shape) {
        if (shapeA instanceof Circle && shapeB instanceof Circle) {
            return Collision.decideCircleCollision(shapeA, shapeB);
        }

        if (shapeA instanceof Rectangle && shapeB instanceof Rectangle) {
            return Collision.decideRectangleCollision(shapeA, shapeB);
        }

        if (shapeA instanceof Rectangle && shapeB instanceof Circle ) {
            return Collision.decideCircleRectangleCollision(shapeB, shapeA);
        } else if (shapeA instanceof Circle && shapeB instanceof Rectangle ) {
            return Collision.decideCircleRectangleCollision(shapeA, shapeB);
        }
    }


    /**
     *  Algorithmus zur Kollisionerkennung zweier Kreise: 
     *  Sei d der Abstand zwischen den Mittelpunkten zweier Kreise A und B und r die Summe der Radiuse r(A) und r(B)
     *  dann kollidieren die Kreise, wenn gilt:
     *  d <= r
     */
    private static decideCircleCollision(circleA: Circle, circleB: Circle): boolean {
        const distance = Point.distanceBetween(circleA.position, circleB.position);
        const radii = circleA.radius + circleB.radius;
        const isColliding = distance <= radii;

        return isColliding;
    }

    private static decideRectangleCollision(rectA: Rectangle, rectB: Rectangle) {

    }
    
    private static decideCircleRectangleCollision(circle: Circle, rect: Rectangle) {

    }
}