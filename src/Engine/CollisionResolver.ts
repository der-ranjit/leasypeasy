import { Shape } from "./Shapes/Shape.abstract";
import { Rectangle, Circle } from "./Shapes";

export interface BoundaryRect {
     left: number;
     top: number;
     right: number;
     bottom: number;
}

export namespace CollisionResolver {
    /**
     * Returns false when there was no collision at the newPosition
     * TODO if newPosition exceeds boundaries, calculate overlap and teleport shape to edge 
     */
    export function checkAndResolveBoundaries(
        shape: Shape,
        boundaryRect: BoundaryRect
    ): void {
        // Rectangle
        if (shape instanceof Rectangle) {
            resolveRectangleBoundary(shape, boundaryRect)
        }
        // Circle
        if (shape instanceof Circle) {
            resolveCircleBoundary(shape, boundaryRect)
        }
    }

    function resolveCircleBoundary(shape: any, boundaryRect: BoundaryRect) {
        const position = shape.position;
        const rightCollision = position.x + shape.radius > boundaryRect.right;
        const leftCollision = position.x - shape.radius < boundaryRect.left;
        const bottomCollision = position.y + shape.radius > boundaryRect.bottom;
        const topCollision = position.y - shape.radius < boundaryRect.top;
        if (rightCollision || leftCollision) {
            if (rightCollision) {
                shape.position.x -= position.x + shape.radius - boundaryRect.right;
            } else {
                shape.position.x += boundaryRect.left - (position.x - shape.radius);
            }
            // invert velocity
            shape.velocity.x = -shape.velocity.x;
            shape.onBoundaryCollision$.next();
        }
        if (bottomCollision || topCollision) {
            if (bottomCollision) {
                shape.position.y -= position.y + shape.radius - boundaryRect.bottom;
            } else {
                shape.position.y += boundaryRect.top - (position.y - shape.radius);
            }
            // invert velocity
            shape.velocity.y = -shape.velocity.y;
            shape.onBoundaryCollision$.next();
        }
    }

    function resolveRectangleBoundary(shape: any, boundaryRect: BoundaryRect) {
        const position = shape.position;
        const rightCollision = position.x + shape.width > boundaryRect.right;
        const leftCollision = position.x < boundaryRect.left;
        const bottomCollision = position.y + shape.height > boundaryRect.bottom;
        const topCollision = position.y < boundaryRect.top;
        if (rightCollision || leftCollision) {
            if (rightCollision) {
                shape.position.x -= position.x + shape.width - boundaryRect.right;
            } else {
                shape.position.x += boundaryRect.left - position.x ;
            }
            // invert velocity
            shape.velocity.x = -shape.velocity.x;
            shape.onBoundaryCollision$.next();
        }
        if (bottomCollision || topCollision) {
            if (bottomCollision) {
                shape.position.y -= position.y + shape.height - boundaryRect.bottom;
            } else {
                shape.position.y += boundaryRect.top - position.y; 
            }
            // invert velocity
            shape.velocity.y = -shape.velocity.y;
            shape.onBoundaryCollision$.next();
        }
    }
}