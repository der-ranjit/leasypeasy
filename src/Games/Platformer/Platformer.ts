import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { MainLoop, GameObject, DrawConfiguration } from "../../Engine";
import { Color, MathUtils } from "../../Engine/utils";
import { Game } from "../Game.abstract";
import { Circle } from "../../Engine/Geometry/Shapes/Circle";
import { Point } from "../../Engine/Geometry/Point";
import { Vector2D } from "../../Engine/Geometry/Vector2D";

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
        this.mainLoop.onLoopStart$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            if (this.controls.isKeyPressed("ArrowRight")) {
                // player.velocity.setAngle(MathUtils.degreesToRadian(0));
                // player.velocity.setLength(10);
                player!.physics.velocity.add(movementVector);
            }
            if (this.controls.isKeyPressed("ArrowLeft")) {
                // player.velocity.setAngle(MathUtils.degreesToRadian(180));
                // player.velocity.setLength(10);
                player!.physics.velocity.add(Vector2D.from(movementVector).scale(-1));
            }
        });
        
        this.controls.onKeyDown(" ").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            player!.physics.velocity.setAngle(MathUtils.degreesToRadian(270));
            player!.physics.velocity.setLength(25);
            // player.velocity.add(jumpVector);
            // player.velocity.setLength(50);
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