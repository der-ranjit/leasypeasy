import { Point } from "./Point";
import { MathUtils } from "./MathUtils";

export class Vector2D {
    public static VectorFromAngle(angleInDegrees: number): Vector2D {
        const radian = MathUtils.degreesToRadian(angleInDegrees);
        // pythagoras
        const x = Math.cos(radian);
        const y = Math.sin(radian);
        return new Vector2D(x, y);
    }
    public static from(point: Point): Vector2D;
    public static from(vector: Vector2D): Vector2D;
    public static from(pointOrVector: any): Vector2D {
        return new Vector2D(pointOrVector.x, pointOrVector.y);
    }
    
    public static normalize(vector: Vector2D) {
        return Vector2D.from(vector).normalize();
    }

    public static pointToPoint(pointA: Point, pointB: Point): Vector2D {
        const directionalVector = Point.sub(pointB, pointA);
        return Vector2D.from(directionalVector);
    }


    public static scale(vector: Vector2D, scalar: number) {
        return Vector2D.from(vector).scale(scalar);
    }
 
    public get point(): Point {
        return new Point(this.x, this.y);
    }

    constructor(
        public x: number,
        public y: number
    ) {
    }

    /** Return the angle between the vector and the x axis */
    public getAngleInDegrees() {
        const radian = Math.atan2(this.y, this.x);
        return MathUtils.radianToDegrees(radian);
    }

    public setAngle(angleInDegrees: number): Vector2D;
    public setAngle(vector: Vector2D): Vector2D;
    public setAngle(angleOrVector: any): Vector2D {
        const length = this.getLength();
        if (typeof angleOrVector === "number") {
            const angledVector = Vector2D.VectorFromAngle(angleOrVector);
            angledVector.setLength(length);
            this.copy(angledVector);
        } else if (angleOrVector instanceof Vector2D) {
            this.copy(angleOrVector);
            this.setLength(length)
        }
        return this;
    }

    public scale(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    public add(vector: Vector2D) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    public copy(vector: Vector2D) {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    public clone() {
        return new Vector2D(this.x, this.y);
    }

    /**
     * Sets the length of this vector to the desired one, keeping its direction
     */
    public setLength(length: number) {
        const currentLength = this.getLength();
        if (currentLength !== 0) {
            const normalizeScalar = length / currentLength;
            this.scale(normalizeScalar);
        }
        return this;
    }

    public getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normalize() {
        this.setLength(1);
        return this;
    }

    public getScalar(v: Vector2D): number {
        return this.x * v.x + this.y * v.y;
    }
}