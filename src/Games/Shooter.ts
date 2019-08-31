import { Color, Point, Renderer, Controls, MathUtils } from "./../Engine";
import { Square, Circle } from "../Engine/Shapes";
import { Vector2D } from "../Engine/Vector2D";
import { Shape } from "../Engine/Shapes/Shape.abstract";

export const Shooter = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    const controls = Controls.getInstance();
    
    canvas.width = 1200;
    canvas.height = 600;

    const spawnerPosition = new Point(20, 20);
    const spawner = new Square(spawnerPosition, 20, renderer);

    const bullets: Shape[] = [];

    const addBullet = () => {
        const speed = 5;

        const bullet = new Circle(spawnerPosition, 2, renderer);
        bullet.velocity = new Vector2D(1, 1).setLength(speed);
        bullets.push(bullet);
        bullet.onBoundaryCollision$.subscribe(_ => addBullet());
    }

    controls.onKeyDown(" ").subscribe(_ => {
        addBullet();
    });

    renderer.onLoopEnd$.subscribe(_ => console.log("loopEnd"));

    controls.onKeyDown("p").subscribe(_ => {
        renderer.isRunning ? renderer.pause() : renderer.unpause();
    });;
    
    controls.onKeyDown("r").subscribe(_ => {
        bullets.forEach(bullet => bullet.destroy());
        bullets.splice(0, bullets.length) ;
    });

}