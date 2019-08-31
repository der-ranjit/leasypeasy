import { Circle } from "../Engine/Shapes";
import { Vector2D } from "../Engine/Vector2D";
import { Color, Controls, Point, Renderer, Collision } from "./../Engine";

export const Shooter = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    const controls = Controls.getInstance();
    
    canvas.width = 1200;
    canvas.height = 600;

    let lisiScore = 0;
    let ranzScore = 0;
    
    const lisiPosition = new Point(20, canvas.height / 2);
    const ranzPosition = new Point(canvas.width - 20, canvas.height / 2);
    
    const lisi = new Circle(lisiPosition, 15, renderer, Color.MAGENTA);
    lisi.showVelocityIndicator = true;
    lisi.isControlled = true;
    lisi.gravityEnabled = false;
    lisi.up = "w";
    lisi.down = "s";
    lisi.left = "a";
    lisi.right = "d";
    
    const ranz = new Circle(ranzPosition, 15, renderer);
    ranz.showVelocityIndicator = true;
    ranz.isControlled = true;
    ranz.gravityEnabled = false;

    lisi.gravitationSources.push(ranz);
    ranz.gravitationSources.push(lisi);

    const lisisLittleBalls: Circle[] = [];
    const ranzLittleBalls: Circle[] = [];

    renderer.onBeforeUpdate$.subscribe(_ => {
        lisisLittleBalls.forEach(lisiBall => {
           if (Collision.isColliding(lisiBall, ranz)) {
               lisiScore++;
               lisi.radius = lisi.radius + 0.5;
               ranz.radius = ranz.radius - 0.5;
               destroyLittleBall(lisiBall, lisisLittleBalls);
           }
        });

        ranzLittleBalls.forEach(ranzBall => {
            if (Collision.isColliding(ranzBall, lisi)) {
                ranzScore++;
                ranz.radius = ranz.radius + 0.5;
                lisi.radius = lisi.radius - 0.5;
                destroyLittleBall(ranzBall, ranzLittleBalls);
            }
         });

    });


    renderer.onLoopEnd$.subscribe(_ => {
        renderer.context.strokeText(`countLisi: ${lisiScore}`, 1100, 50);
        renderer.context.strokeText(`countRanz: ${ranzScore}`, 1100, 100);
        if (ranzScore === 6) {
            renderer.pause();
            renderer.context.strokeText(`Ranz hat große Balls`, 600, 300);
         }

         if (lisiScore === 6) {
            renderer.pause();
            renderer.context.strokeText(`Lisi hat große Balls`, 600, 300);
         }
    });

    controls.onKeyDown("q").subscribe(_ => {
        let littleBall = createShootingBall(lisi, Color.GREEN, lisisLittleBalls);
        lisisLittleBalls.push(littleBall);
    });

    controls.onKeyDown(" ").subscribe(_ => {
        let littleBall = createShootingBall(ranz, Color.BLUE, ranzLittleBalls);
        ranzLittleBalls.push(littleBall);
        
    });

    controls.onKeyDown("p").subscribe(_ => {
        renderer.isRunning ? renderer.pause() : renderer.unpause();
    });

    const destroyLittleBall = (ball: Circle, balls: Circle[]) => {
        ball.destroy();
        const index = balls.indexOf(ball);
        balls.splice(index, 1);
    }

    const createShootingBall = (circle: Circle, color = Color.BLACK, balls: Circle[]) => {
        let littleBall = new Circle(circle.position, 5, renderer, color);
        littleBall.velocity = Vector2D.from(circle.velocity).setLength(4);
        littleBall.onBoundaryCollision$.subscribe(_ => {
            destroyLittleBall(littleBall, balls);
        })
        return littleBall;
    }

}