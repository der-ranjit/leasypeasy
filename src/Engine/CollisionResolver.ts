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
        newPosition: Point,
        shape: Shape,
        boundaryRect: BoundaryRect
    ): boolean {
        // TODO figure out being unable to use tpye of Shapes here
        const anyShape = <any>shape;
        // Rectangle
        if (anyShape.width && anyShape.height) {
            if (newPosition.x + anyShape.width > boundaryRect.right || newPosition.x < boundaryRect.left) {
                invertXVelocity(shape);
                return true;
            }
            if (newPosition.y + anyShape.height > boundaryRect.bottom || newPosition.y < boundaryRect.top) {
                invertYVelocity(shape);
                return true;
            }
        }
        // Circle
        if (anyShape.radius) {
            if (newPosition.x + anyShape.radius > boundaryRect.right || newPosition.x - anyShape.radius < boundaryRect.left) {
                invertXVelocity(shape);
                return true;
            }
            if (newPosition.y + anyShape.radius > boundaryRect.bottom || newPosition.y - anyShape.radius < boundaryRect.top) {
                invertYVelocity(shape);
                return true;
            }
        }

        return false;
    }

    function invertXVelocity(shape: Shape) {
        shape.velocity.x = -shape.velocity.x;
    }

    function invertYVelocity(shape: Shape) {
        shape.velocity.y = -shape.velocity.y;
    }
}