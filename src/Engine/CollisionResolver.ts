import { Shape } from "./Shapes/Shape.abstract";
import { Point } from "./Point";

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
        // TODO figure out being unable to use tpye of Shapes here
        // Rectangle
        if ((<any>shape).width && (<any>shape).height) {
            resolveRectangleBoundary(shape, boundaryRect)
        }
        // Circle
        if ((<any>shape).radius) {
            resolveCircleBoundary(shape, boundaryRect)
        }
    }

    // TODO figure out being unable to use tpye of Shapes here
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
            invertXVelocity(shape);
        }
        if (bottomCollision || topCollision) {
            if (bottomCollision) {
                shape.position.y -= position.y + shape.radius - boundaryRect.bottom;
            } else {
                shape.position.y += boundaryRect.top - (position.y - shape.radius);
            }
            invertYVelocity(shape);
        }
    }

    // TODO figure out being unable to use tpye of Shapes here
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
            invertXVelocity(shape);
        }
        if (bottomCollision || topCollision) {
            if (bottomCollision) {
                shape.position.y -= position.y + shape.height - boundaryRect.bottom;
            } else {
                shape.position.y += boundaryRect.top - position.y; 
            }
            invertYVelocity(shape);
        }
    }

    function invertXVelocity(shape: Shape) {
        shape.direction.x = -shape.direction.x;
    }

    function invertYVelocity(shape: Shape) {
        shape.direction.y = -shape.direction.y;
    }
}