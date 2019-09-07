import { Shape } from "../Geometry";
import { BoundaryRect, CollisionResolver } from "./CollisionResolver";
import { CollisionDetector } from "./CollisionDetector";

export interface Collidable extends Shape {
    checkBoundaries: boolean;
    isColliding: boolean;
    collisionObjects: Collidable[];
}

export function isCollidable(object: any): object is Collidable {
    return (object as Collidable).isColliding !== undefined;
}

export namespace Collision {
    export function detectAndResolveCollisions(collidables: Collidable[], boundaries?: BoundaryRect) {
        collidables.forEach(object => object.collisionObjects = []);
        for (let i = 0; i < collidables.length; i++) {
            const collidableA = collidables[i];
            if (boundaries && collidableA.checkBoundaries) {
                CollisionResolver.checkAndResolveBoundaries(collidableA, boundaries);
                
            }
            for (let j = i + 1; j < collidables.length; j++) {
                let collidableB = collidables[j];
                if (collidableA && collidableB) {
                    let isColliding = CollisionDetector.isColliding(collidableA, collidableB);
                    // TODO create proper information collidable about collision participants
                    if (isColliding) {
                        collidableA.collisions.push(collidableB);
                        collidableB.collisions.push(collidableA);
                    }
                }
            }
        }
    }
}