import { Point, Circle, Rectangle } from "../Geometry";
import { MathUtils } from "../utils";
import { GameObject } from "../GameObject";

export namespace CollisionDetector {
    export function isColliding(gameObjectA: GameObject, gameObjectB: GameObject): boolean {
        if (gameObjectA instanceof Circle && gameObjectB instanceof Circle) {
            return decideCircleCollision(gameObjectA, gameObjectB);
        }

        if (gameObjectA instanceof Rectangle && gameObjectB instanceof Rectangle) {
            return decideRectangleCollision(gameObjectA, gameObjectB);
        }

        if (gameObjectA instanceof Rectangle && gameObjectB instanceof Circle ) {
            return decideCircleRectangleCollision(gameObjectB, gameObjectA);
        } else if (gameObjectA instanceof Circle && gameObjectB instanceof Rectangle ) {
            return decideCircleRectangleCollision(gameObjectA, gameObjectB);
        }

        return false;
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
        const xRangesIntersecting = MathUtils.rangesIntersect(
            rectA.position.x,
            rectA.position.x + rectA.width,
            rectB.position.x,
            rectB.position.x + rectB.width,
        );
        const yRangesIntersecting = MathUtils.rangesIntersect(
            rectA.position.y,
            rectA.position.y + rectA.height,
            rectB.position.y,
            rectB.position.y + rectB.height,
        );
        if (xRangesIntersecting && yRangesIntersecting) {
            return true;
        }

        return false;
    }
    
    function decideCircleRectangleCollision(circle: Circle, rect: Rectangle): boolean {
        // Find the closest point to the circle within the rectangle
        const closestX = MathUtils.clamp(circle.position.x, rect.position.x, rect.position.x + rect.width);
        const closestY = MathUtils.clamp(circle.position.y, rect.position.y, rect.position.y + rect.height);

        // Calculate the distance between the circle's center and this closest point
        const distanceX = circle.position.x - closestX;
        const distanceY = circle.position.y - closestY;

        // If the distance is less than the circle's radius, an intersection occurs
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
        return distanceSquared < (circle.radius * circle.radius);
    }
}