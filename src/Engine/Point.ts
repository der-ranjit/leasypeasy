export class Point {

    public static add(pointA: Point, pointB: Point): Point {
        const newX = pointB.x += pointA.x;
        const newY = pointB.y += pointA.y;

        return new Point(newX, newY);
    }

    public static distanceBetween(pointA: Point, pointB: Point): number {
        const a = Math.abs(pointB.x - pointA.x);
        const b = Math.abs(pointB.y - pointA.y);
        const distance = Math.sqrt((a * a) + (b * b));
        return distance;
    }

    constructor(public x: number, public y: number) {
    }

    public add(point: Point) {
        this.x += point.x;
        this.y += point.y;
        return this;
    }

    public multiply(factor: number) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    public distanceTo(otherPoint: Point): number {
        return Point.distanceBetween(this, otherPoint);
    }
}