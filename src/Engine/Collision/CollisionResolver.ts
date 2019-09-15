import { GameObject } from "../GameObject";
import { Rectangle } from "../Geometry/Shapes/Rectangle";
import { Circle } from "../Geometry/Shapes/Circle";

export interface BoundaryRect {
     left: number;
     top: number;
     right: number;
     bottom: number;
}

export type BoundaryCollision = "left" | "right" | "top" | "bottom";

export namespace CollisionResolver {
    /**
     * Returns false when there was no collision at the newPosition
     */
    export function checkAndResolveBoundaries(
        gameObject: GameObject,
        boundaryRect: BoundaryRect
    ): void {
        // Rectangle
        if (gameObject instanceof Rectangle) {
            resolveRectangleBoundary(gameObject, boundaryRect)
        }
        // Circle
        if (gameObject instanceof Circle) {
            resolveCircleBoundary(gameObject, boundaryRect)
        }
    }
    
    function resolveCircleBoundary(shape: Circle, boundaryRect: BoundaryRect) {
        const position = shape.position;
        const rightCollision = position.x + shape.radius > boundaryRect.right;
        const leftCollision = position.x - shape.radius < boundaryRect.left;
        const bottomCollision = position.y + shape.radius > boundaryRect.bottom;
        const topCollision = position.y - shape.radius < boundaryRect.top;

        if (rightCollision) {
            shape.position.x -= position.x + shape.radius - boundaryRect.right;
            shape.onBoundaryCollision$.next("right");
        }
        if (leftCollision)  {
            shape.position.x += boundaryRect.left - (position.x - shape.radius);
            shape.onBoundaryCollision$.next("left");
        }
        if (bottomCollision) {
            shape.position.y -= position.y + shape.radius - boundaryRect.bottom;

            shape.physics.velocity.y *= -0.5;
            if (Math.abs(shape.physics.velocity.y) < 1) {
                shape.physics.velocity.y = 0;
            }

            shape.onBoundaryCollision$.next("bottom");
        }
        if (topCollision) {
            shape.position.y += boundaryRect.top - (position.y - shape.radius);
            shape.onBoundaryCollision$.next("top");
        }
    }

    function resolveRectangleBoundary(shape: Rectangle, boundaryRect: BoundaryRect) {
        const position = shape.position;
        const rightCollision = position.x + shape.width > boundaryRect.right;
        const leftCollision = position.x < boundaryRect.left;
        const bottomCollision = position.y + shape.height > boundaryRect.bottom;
        const topCollision = position.y < boundaryRect.top;

        if (rightCollision) {
            shape.position.x -= position.x + shape.width - boundaryRect.right;
            shape.onBoundaryCollision$.next("right");
        }
        if (leftCollision) {
            shape.position.x += boundaryRect.left - position.x ;
            shape.onBoundaryCollision$.next("left");
        }
        if (bottomCollision) {
            shape.position.y -= position.y + shape.height - boundaryRect.bottom;
            shape.onBoundaryCollision$.next("bottom");
        }
        if (topCollision) {
            shape.position.y += boundaryRect.top - position.y; 
            shape.onBoundaryCollision$.next("top");
        }
    }
}