import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { Renderer } from "../../Engine";
import { Color, MathUtils } from "../../Engine/utils";
import { Point } from "../../Engine/Geometry";
import { Player } from "../Shooter/Player";
import { Game } from "../Game.abstract";

export class Platformer extends Game {
    public name = "platformz aiiight";
    public started = false;

    private destroyed$ = new Subject<void>();

    private players: Player[] = [];

    constructor(renderer: Renderer) {
        super(renderer);
    }

    public start() {
        this.mainScript();
        this.started = false;
    }

    public destroy() {
        this.destroyed$.next();
        for (const player of this.players) {
            player.destroy();
        }
        this.players = [];
        this.started = false;
    }

    private mainScript() {
        this.canvas.width = 1200;
        this.canvas.height = 600;


        this.controls.onKeyDown("Enter").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
        });
    }

    private createPlayer(i: number) {
        const player = new Player(
            "Player " + i,
            new Point(
                MathUtils.randomInt(20, this.canvas.width - 20),
                MathUtils.randomInt(20, this.canvas.height - 20),
            ),
            Color.RANDOM_COLOR, Color.RANDOM_COLOR,
            this.renderer
        );
        player.circle.velocity.setLength(1).setAngle(MathUtils.degreesToRadian(MathUtils.randomInt(0, 100)));
        this.players.push(player);
        this.renderer.onUpdate$.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            player.circle.velocity.rotate(i % 2 === 0 ? 3 : -3);
            player.shoot();
        });
    }
}