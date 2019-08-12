export class Point {
    constructor(public x: number, public y: number) {
    }

    public add(point: Point) {
        this.x += point.x;
        this.y += point.y;
    }
}