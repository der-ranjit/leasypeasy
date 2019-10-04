import { GameObject } from "../GameObject";
import { Vector2D, Point } from "../Geometry";
import { Circle } from "../Geometry/Shapes/Circle";
import { Rectangle } from "../Geometry/Shapes/Rectangle";
import { CollisionDetector } from "../Collision";

export namespace Physics {
    export function applyPhysics(physicObjects: GameObject[], delta: number) {
        physicObjects.forEach(object => {
            if (object.physics.gravityEnabled) {
                object.physics.gravityVector = computeGravity(object);
                object.physics.velocity.add(object.physics.gravityVector);
            } 

            object.physics.velocity.add(object.physics.acceleration);

            let resolved = false;
            physicObjects.forEach(object => object.physics.resolvedCollisions = []);
            for (let i = 0; i < physicObjects.length; i++) {
                const otherObject = physicObjects[i];
                if (otherObject !== object &&
                    object instanceof Rectangle &&
                    otherObject instanceof Rectangle &&
                    !object.physics.resolvedCollisions.includes(otherObject) &&
                    !otherObject.physics.resolvedCollisions.includes(object)
                ) {
                    const isResolved = resolveRectangleRectangleCollision(object, otherObject);
                    if (isResolved) {
                        object.physics.resolvedCollisions.push(otherObject);
                        resolved = true;
                    }
                }
            }
            if (!resolved) {
                object.move(object.physics.velocity);
            }
        })
    }

    function computeGravity(gameObject: GameObject): Vector2D {
        let gravity = new Vector2D(0, 0);
        if (gameObject.physics.gravitationSources.length > 0) {
            if (gameObject instanceof Circle) {
                for (const gravitationSource of gameObject.physics.gravitationSources) {
                    if (gravitationSource instanceof Circle) {
                        gravity.add(gravitateTo(gameObject, gravitationSource));
                    }
                }
            }
        } else {
            const mass = 20;
            gravity = Vector2D.scaled(gameObject.physics.defaultGravity, mass);
        }

        return gravity;
    }

    function gravitateTo(from: Circle, to: Circle): Vector2D {
        const gravity = new Vector2D(0, 0);
        
        let distance = Point.distanceBetween(from.position, to.position);
        const radii = from.radius;
        if (distance < radii) {
            distance = radii;
        }
        
        const mass = (from.physics.mass + to.physics.mass) / 2;
		gravity.setLength(mass / (distance * distance));
		gravity.setAngle(from.position.angleTo(to.position));
		return gravity;
    }

    function resolveRectangleRectangleCollision(rectangleA: Rectangle, rectangleB: Rectangle): boolean {
        const nextPositionX = new Point(
            rectangleA.position.x + rectangleA.physics.velocity.x,
            rectangleA.position.y
        )
        const nextPositionY = new Point(
            rectangleA.position.x,
            rectangleA.position.y + rectangleA.physics.velocity.y
        )
        const horizonticallyColliding = CollisionDetector.decideRectangleCollisionDeltaPosition(
            rectangleA,
            nextPositionX,
            rectangleB
        );
        const verticallyColliding = CollisionDetector.decideRectangleCollisionDeltaPosition(
            rectangleA,
            nextPositionY,
            rectangleB
        );
        if ( verticallyColliding ) {
            if (rectangleA.physics.velocity.y > 0) {
                rectangleA.position.y = rectangleB.position.y - rectangleA.height - 1;
            } else if (rectangleA.physics.velocity.y < 0){
                rectangleA.position.y = rectangleB.position.y + rectangleB.height + 1;
            }

            rectangleA.physics.velocity.y = 0;
            rectangleA.position.x += rectangleA.physics.velocity.x;
            
            return true;
        } else if ( horizonticallyColliding ) {
            if (rectangleA.physics.velocity.x > 0 ) {
                rectangleA.position.x = rectangleB.position.x - rectangleA.width -1;
            } else if (rectangleA.physics.velocity.x < 0 ){
                rectangleA.position.x = rectangleB.position.x + rectangleB.width + 1;
            }
            
            rectangleA.physics.velocity.x = 0;
            rectangleA.position.y += rectangleA.physics.velocity.y;

            return true;
        }        

        return false;
    }
}