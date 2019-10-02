import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { MainLoop, GameObject, DrawConfiguration } from "../../Engine";
import { Color, MathUtils } from "../../Engine/utils";
import { Game } from "../Game.abstract";
import { Point } from "../../Engine/Geometry/Point";
import { Vector2D } from "../../Engine/Geometry/Vector2D";
import { Rectangle } from "../../Engine/Geometry/Shapes/Rectangle";

export class Platformer extends Game {
    public name = "platformz aiiight";
    public started = false;

    private destroyed$ = new Subject<void>();
    private objects: GameObject[] = [];
    private player: Rectangle | null = null;
    private platforms: Rectangle[] = [];
    private jumpMeter = 1;

    constructor(mainLoop: MainLoop) {
        super(mainLoop);
    }

    public start() {
        this.mainScript();
        this.started = true;
    }

    public destroy() {
        for (const renderObject of this.objects) {
            renderObject.destroy();
        }
        this.objects = [];
        this.platforms = [];
        this.started = false;
        this.destroyed$.next();
    }

    private mainScript() {
        this.canvas.width = 1200;
        this.canvas.height = 600;

        this.player = this.createPlayer();

        this.setupControls();
        this.createInitialPlatforms();

        this.mainLoop.onLoopEnd$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.context.strokeText(`${this.player!.physics.velocity.x} | ${this.player!.physics.velocity.y}`, 20 , 20);
            this.context.strokeText(`${this.player!.position.x} | ${this.player!.position.y}`, 20 , 40);
        });
        this.mainLoop.onUpdate$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.checkEndingConditions();

        });
    }


    private createInitialPlatforms() {
        const initialCount = 5
        for (let index = 0; index < initialCount; index++) {
            const platform = this.createPlatform();
            this.platforms.push(platform);
            this.objects.push(platform);
        }
    }


    private checkEndingConditions() {
        // if (this.player && this.player.position.y + this.player.height >= this.canvas.height) {
        //     this.mainLoop.pause();
        //     this.destroy();
        //     this.start();
        // }
        this.platforms.forEach(platform => {
            platform.physics.velocity = new Vector2D(-2, 0);
        });
    }

    private setupControls() {
        const maxSpeed = 4;
        const friction = 0.4;
        const acceleration = 0.2;
        const stopSpeedThreshold = 0.1;
        const jumpReloadRate = 0.05;

        this.mainLoop.onUpdate$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            if (this.player && !this.controls.isKeyPressed("ArrowRight") && !this.controls.isKeyPressed("ArrowLeft")) {
                if (Math.abs(this.player.physics.velocity.x) < stopSpeedThreshold) {
                    this.player.physics.velocity.x = 0;
                } 
                if (this.player.physics.velocity.x !== 0) {
                    this.player.physics.velocity.x *= friction;
                } 
            }

            if (this.jumpMeter < 1) {
                this.jumpMeter += jumpReloadRate;
            }

            if (this.player) {
                if (this.controls.isKeyPressed("ArrowRight") && this.player.physics.velocity.x < maxSpeed) {
                    this.player.physics.velocity.x += acceleration;
                }
                if (this.controls.isKeyPressed("ArrowLeft") && this.player.physics.velocity.x > -maxSpeed) {
                    this.player.physics.velocity.x -= acceleration;
                }
            }
        });
        
        this.controls.onKeyDown("ArrowUp").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            if (this.player && this.jumpMeter >= 1) {
                this.jumpMeter = 0;
                this.player.physics.velocity.y = -30;
            }
        });
    }

    private createPlayer() {
        const player = new Rectangle(new Point(200, 200), 20, 40, this.mainLoop, new DrawConfiguration(
            Color.GREEN,
            Color.BLACK,
            1,
            10
        ));
        player.physics.velocity = new Vector2D(0, 0);
        player.physics.gravityEnabled = true;
        player.onBoundaryCollision$.pipe(takeUntil(this.destroyed$)).subscribe((position) => {
            if (position === "left" || position === "right") {
                player.physics.velocity.x *= -0.7;
            }
            if (position === "top" ) {
                player.physics.velocity.y *= -0.7;
            }
        });
        this.objects.push(player);
        return player;
    }

    private createPlatform(atRightEdge?: boolean): Rectangle {
        const minWidht = 50;
        const maxWidth = 100;
        const minHeight = 40;
        const maxHeight = 80;

        const width = MathUtils.randomInt(minWidht, maxWidth);
        const height = MathUtils.randomInt(minHeight, maxHeight);
        const platform = new Rectangle(
            new Point(
                atRightEdge ? this.canvas.width - width : MathUtils.randomInt(0, this.canvas.width - width),
                MathUtils.randomInt(this.canvas.height - 200, this.canvas.height),
            ),
            width,
            height,
            this.mainLoop, 
            new DrawConfiguration()
        );

        // platform.collision.noclip = true;
        platform.onBoundaryCollision$.subscribe(_ => {
            this.platforms.splice(this.platforms.indexOf(platform), 1);
            this.objects.splice(this.objects.indexOf(platform), 1);
            platform.destroy();
            this.platforms.push(this.createPlatform(true));
        })
        this.objects.push(platform);
        return platform;
    }
}
