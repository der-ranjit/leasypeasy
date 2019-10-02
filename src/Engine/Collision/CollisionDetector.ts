import { Point } from "../Geometry";
import { MathUtils } from "../utils";
import { GameObject } from "../GameObject";
import { Circle } from "../Geometry/Shapes/Circle";
import { Rectangle } from "../Geometry/Shapes/Rectangle";

export namespace CollisionDetector {
    export function isColliding(gameObjectA: GameObject, gameObjectB: GameObject): boolean {
        if (!gameObjectA.collision.noclip && !gameObjectB.collision.noclip) {
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
        }

        return false;
    }


    /**
     *  Algorithmus zur Kollisionerkennung zweier Kreise: 
     *  Sei d der Abstand zwischen den Mittelpunkten zweier Kreise A und B und r die Summe der Radiuse r(A) und r(B)
     *  dann kollidieren die Kreise, wenn gilt:
     *  d <= r
     */
    export function decideCircleCollision(circleA: Circle, circleB: Circle): boolean {
        const distance = Point.distanceBetween(circleA.position, circleB.position);
        const radii = circleA.radius + circleB.radius;
        const isColliding = distance <= radii;

        return isColliding;
    }

    export function decideRectangleCollision(rectA: Rectangle, rectB: Rectangle): boolean {
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
    

    export function decideRectangleCollisionDeltaPosition(rectA: Rectangle, deltaPosition: Point, rectB: Rectangle): boolean {
        const xRangesIntersecting = MathUtils.rangesIntersect(
            deltaPosition.x,
            deltaPosition.x + rectA.width,
            rectB.position.x,
            rectB.position.x + rectB.width,
        );
        const yRangesIntersecting = MathUtils.rangesIntersect(
            deltaPosition.y,
            deltaPosition.y + rectA.height,
            rectB.position.y,
            rectB.position.y + rectB.height,
        );
        if (xRangesIntersecting && yRangesIntersecting) {
            return true;
        }
        return false;
    }
    
    export function decideCircleRectangleCollision(circle: Circle, rect: Rectangle): boolean {
        // Find the closest point to the circle within the rectangle
        const closestX = MathUtils.clamp(circle.position.x, rect.position.x, rect.position.x + rect.width);
        const closestY = MathUtils.clamp(circle.position.y, rect.position.y, rect.position.y + rect.height);

        // Calculate the distance between the circle's center and this closest point
        const distanceX = circle.position.x - closestX;
        const distanceY = circle.position.y - closestY;

        // If the distance is less than the circle's radius, an intersection occurs
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
        const result = distanceSquared < (circle.radius * circle.radius); 
        return result;
    }
}