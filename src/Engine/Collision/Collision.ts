import { BoundaryRect, CollisionResolver } from "./CollisionResolver";
import { CollisionDetector } from "./CollisionDetector";
import { GameObject } from "../GameObject";

export namespace Collision {
    export function detectAndResolveCollisions(collidables: GameObject[], boundaries?: BoundaryRect) {
        collidables.forEach(object => object.collision.collisions = []);
        for (let i = 0; i < collidables.length; i++) {
            const collidableA = collidables[i];
            if (boundaries && collidableA.collision.checkBoundaries) {
                CollisionResolver.checkAndResolveBoundaries(collidableA, boundaries);
                
            }
            for (let j = i + 1; j < collidables.length; j++) {
                let collidableB = collidables[j];
                if (collidableA && collidableB) {
                    let isColliding = CollisionDetector.isColliding(collidableA, collidableB);
                    // TODO create proper information collidable about collision participants
                    if (isColliding) {
                        collidableA.collision.collisions.push(collidableB);
                        collidableB.collision.collisions.push(collidableA);
                    }
                }
            }
        }
    }
}