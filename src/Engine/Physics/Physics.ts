import { Shape } from "../Geometry/Shapes";
import { Point } from "../Geometry/Point";

export interface PhysicObject extends Shape {
    mass: number;
    position: Point;
}

export function isPhysicObject(object: any): object is PhysicObject {
    return (object as PhysicObject).mass !== undefined;
}

export namespace Physics {
    export function applyPhysics(physicObjects: PhysicObject[], delta: number) {

    }
}