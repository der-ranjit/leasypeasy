import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { Renderer, RenderObject } from "../../Engine";
import { Color, MathUtils } from "../../Engine/utils";
import { Point, Square, Circle, Vector2D } from "../../Engine/Geometry";
import { Player } from "../Shooter/Player";
import { Game } from "../Game.abstract";

export class Platformer extends Game {
    public name = "platformz aiiight";
    public started = false;

    private destroyed$ = new Subject<void>();

    private objects: RenderObject[] = [];

    private player: Circle | null = null;

    constructor(renderer: Renderer) {
        super(renderer);
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
        const movementVector = new Vector2D(5, 0);
        const jumpVector = new Vector2D(0, 20);
        this.renderer.onLoopStart$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            if (this.controls.isKeyPressed("ArrowRight")) {
                // player.velocity.setAngle(MathUtils.degreesToRadian(0));
                // player.velocity.setLength(10);
                player.velocity.add(movementVector);
            }
            if (this.controls.isKeyPressed("ArrowLeft")) {
                // player.velocity.setAngle(MathUtils.degreesToRadian(180));
                // player.velocity.setLength(10);
                player.velocity.add(Vector2D.from(movementVector).scale(-1));
            }
        });
        
        this.controls.onKeyDown(" ").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            player.velocity.setAngle(MathUtils.degreesToRadian(270));
            player.velocity.setLength(25);
            // player.velocity.add(jumpVector);
            // player.velocity.setLength(50);
        });
    }

    private createPlayer() {
        const player = new Circle(new Point(200, 200), 20, this.renderer, Color.RED, Color.BLACK);
        player.velocity = new Vector2D(0, 0);
        player.gravityEnabled = true;
        // player.showStats = true;
        player.onBoundaryCollision$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            player.velocity.scale(0.5);
        });
        this.objects.push(player);
        return player;
    }
}