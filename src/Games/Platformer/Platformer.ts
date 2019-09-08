import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { MainLoop, GameObject, DrawConfiguration } from "../../Engine";
import { Color, MathUtils } from "../../Engine/utils";
import { Game } from "../Game.abstract";
import { Circle } from "../../Engine/Geometry/Shapes/Circle";
import { Point } from "../../Engine/Geometry/Point";
import { Vector2D } from "../../Engine/Geometry/Vector2D";
import { Rectangle } from "../../Engine/Geometry/Shapes/Rectangle";

export class Platformer extends Game {
    public name = "platformz aiiight";
    public started = false;

    private destroyed$ = new Subject<void>();

    private objects: GameObject[] = [];

    private player: Circle | null = null;

    constructor(mainLoop: MainLoop) {
        super(mainLoop);
    }

    public start() {
        this.mainScript();
        this.started = false;
    }

    public destroy() {
        for (const renderObject of this.objects) {
            renderObject.destroy();
        }
        this.objects = [];
        this.started = false;
        this.destroyed$.next();
    }

    private mainScript() {
        this.canvas.width = 1200;
        this.canvas.height = 600;

        this.player = this.createPlayer();
        const player = this.player;
        const movementVector = new Vector2D(1, 0);
        const jumpVector = new Vector2D(0, 20);

        const platforms: Rectangle[] = [];
        const platform = new Rectangle(new Point(400, 400), 100, 20, this.mainLoop, new DrawConfiguration());
        const platform2 = new Rectangle(new Point(600, 300), 100, 20, this.mainLoop, new DrawConfiguration());




        this.mainLoop.onLoopStart$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            if (this.controls.isKeyPressed("ArrowRight")) {
                player!.physics.velocity.add(movementVector);
            }
            if (this.controls.isKeyPressed("ArrowLeft")) {
                player!.physics.velocity.add(Vector2D.from(movementVector).scale(-1));
            }
        });
        
        this.controls.onKeyDown("ArrowUp").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            player!.physics.velocity.setAngle(MathUtils.degreesToRadian(270));
            player!.physics.velocity.setLength(25);
        });
    }

    private createPlayer() {
        const player = new Circle(new Point(200, 200), 20, this.mainLoop, new DrawConfiguration(
            Color.RED,
            Color.BLACK,
            1
        ));
        player.physics.velocity = new Vector2D(0, 0);
        player.physics.gravityEnabled = true;
        // player.showStats = true;
        player.onBoundaryCollision$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            player.physics.velocity.scale(0.5);
        });
        this.objects.push(player);
        return player;
    }
}