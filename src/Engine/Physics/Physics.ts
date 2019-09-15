import { GameObject } from "../GameObject";
import { Vector2D, Point } from "../Geometry";
import { Circle } from "../Geometry/Shapes/Circle";

export namespace Physics {
    export function applyPhysics(physicObjects: GameObject[], delta: number) {
        physicObjects.forEach(object => {
            if (object.physics.gravityEnabled) {
                object.physics.gravityVector = computeGravity(object);
                object.physics.velocity.add(object.physics.gravityVector);
            } 
            
                    object.physics.velocity.add(object.physics.acceleration);
                    object.move(object.physics.velocity);
            
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
}