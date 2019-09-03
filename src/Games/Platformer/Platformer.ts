import { Renderer, Controls, Point, Color, MathUtils } from "../../Engine";
import { PlayerControls, Player } from "../Shooter/Player";
import { Game } from "../Game.abstract";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export class Platformer extends Game {
    public name = "fountains ma bois";
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

        const fountainCount = 5;
        for (let i = 0; i < fountainCount; i++) {
            this.createFountain(i);
        }

        this.controls.onKeyDown("Enter").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            this.createFountain(this.players.length);
        });
    }

    private createFountain(i: number) {
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