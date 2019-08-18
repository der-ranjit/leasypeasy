export class Point {

    public static ADD(pointA: Point, pointB: Point) {
        const newX = pointB.x += pointA.x;
        const newY = pointB.y += pointA.y;

        return new Point(newX, newY);
    }

    constructor(public x: number, public y: number) {
    }

    public add(point: Point) {
        this.x += point.x;
        this.y += point.y;
    }
}