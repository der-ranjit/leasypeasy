import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { MainLoop } from "../../Engine";
import { Color, MathUtils } from "../../Engine/utils";
import { Point } from "../../Engine/Geometry";
import { Player } from "../Shooter/Player";
import { Game } from "../Game.abstract";

export class Fountains extends Game {
    public name = "fountains ma bois";
    public started = false;

    private destroyed$ = new Subject<void>();

    private fountains: Player[] = [];

    constructor(mainLoop: MainLoop) {
        super(mainLoop);
    }

    public start() {
        this.mainScript();
        this.started = false;
    }

    public destroy() {
        this.destroyed$.next();
        for (const player of this.fountains) {
            player.destroy();
        }
        this.fountains = [];
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
            this.createFountain(this.fountains.length);
        });
    }

    private createFountain(i: number) {
        const fountain = new Player(
            "Fountain " + i,
            new Point(
                MathUtils.randomInt(20, this.canvas.width - 20),
                MathUtils.randomInt(20, this.canvas.height - 20),
            ),
            Color.RANDOM_COLOR, Color.RANDOM_COLOR,
            this.mainLoop
        );
        fountain.circle.physics.velocity.setLength(1).setAngle(MathUtils.degreesToRadian(MathUtils.randomInt(0, 100)));
        this.fountains.push(fountain);
        this.mainLoop.onUpdate$.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            fountain.circle.physics.velocity.rotate(i % 2 === 0 ? 3 : -3);
            fountain.shoot();
        });
    }
}