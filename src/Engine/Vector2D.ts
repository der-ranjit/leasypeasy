import { Point } from "./Point";
import { MathUtils } from "./MathUtils";

export class Vector2D {
    public static fromAngle(radian: number): Vector2D {
        const x = Math.cos(radian);
        const y = Math.sin(radian);
        return new Vector2D(x, y);
    }

    public static from(point: Point): Vector2D;
    public static from(vector: Vector2D): Vector2D;
    public static from(pointOrVector: any): Vector2D {
        return new Vector2D(pointOrVector.x, pointOrVector.y);
    }
    
    public static normalized(vector: Vector2D) {
        return Vector2D.from(vector).normalize();
    }

    public static directional(fromPoint: Point, toPoint: Point): Vector2D {
        const directionalVector = Point.sub(toPoint, fromPoint);
        return Vector2D.from(directionalVector);
    }


    public static scaled(vector: Vector2D, scalar: number) {
        return Vector2D.from(vector).scale(scalar);
    }

    public static rotated(vector: Vector2D, degrees: number) {
        return Vector2D.from(vector).rotate(degrees);
    }
    
    public static added(vectorA: Vector2D, vectorB: Vector2D) {
        return Vector2D.from(vectorA).add(vectorB);
    }

    public static subbed(vectorA: Vector2D, vectorB: Vector2D) {
        return Vector2D.from(vectorA).sub(vectorB);
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
        return MathUtils.radianToDegrees(this.getAngle());
    }
    
    public getAngle() {
        return Math.atan2(this.y, this.x);
    }

    public setAngle(radian: number): Vector2D;
    public setAngle(vector: Vector2D): Vector2D;
    public setAngle(vectorOrRadian: any): Vector2D {
        const length = this.getLength();
        if (typeof vectorOrRadian === "number") {
            const angledVector = Vector2D.fromAngle(vectorOrRadian);
            angledVector.setLength(length);
            this.copy(angledVector);
        } else if (vectorOrRadian instanceof Vector2D) {
            this.copy(vectorOrRadian);
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

    public sub(vector: Vector2D) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    /* Rotates the vector by the given angle in degrees */
    public rotate(degrees: number) {
        this.setAngle(this.getAngle() + MathUtils.degreesToRadian(degrees));
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
        var radian = this.getAngle();
		this.x = Math.cos(radian) * length;
		this.y = Math.sin(radian) * length;
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