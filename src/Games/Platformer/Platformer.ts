import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { MainLoop, GameObject, DrawConfiguration } from "../../Engine";
import { Color, MathUtils } from "../../Engine/utils";
import { Game } from "../Game.abstract";
import { Circle } from "../../Engine/Geometry/Shapes/Circle";
import { Point } from "../../Engine/Geometry/Point";
import { Vector2D } from "../../Engine/Geometry/Vector2D";
import { Rectangle } from "../../Engine/Geometry/Shapes/Rectangle";
import { CollisionDetector } from "../../Engine/Collision";

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
        this.mainLoop.onRender$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.handlePlayerPlaftformsCollision();
        })
    }


    private createInitialPlatforms() {
        const initialCount = 5
        for (let index = 0; index < initialCount; index++) {
            const platform = this.createPlatform();
            this.platforms.push(platform);
            this.objects.push(platform);
        }
    }

    private handleCollision(platform: Rectangle) {
        const playerRect = this.player;
        if (!playerRect) return;

        const nextPositionX = new Point(
            playerRect.position.x + playerRect.physics.velocity.x,
            playerRect.position.y
        )
        const nextPositionY = new Point(
            playerRect.position.x,
            playerRect.position.y + playerRect.physics.velocity.y
        )
        
        const check = (width: number, height: number, position: Point, rect: Rectangle) => {
            const xRangesIntersecting = MathUtils.rangesIntersect(
                position.x,
                position.x + width,
                rect.position.x,
                rect.position.x + rect.width,
            );
            const yRangesIntersecting = MathUtils.rangesIntersect(
                position.y,
                position.y + height,
                rect.position.y,
                rect.position.y + rect.height,
            );
            if (xRangesIntersecting && yRangesIntersecting) {
                return true;
            }

            return false;
        }

        const verticallyColliding = check(playerRect.width, playerRect.height, nextPositionY, platform);
        const horizonticallyColliding = check(playerRect.width, playerRect.height, nextPositionX, platform);
        if ( verticallyColliding ) {
            debugger;
            if (playerRect.physics.velocity.y > 0) {
                playerRect.position.y = platform.position.y - playerRect.height;
            } else if (playerRect.physics.velocity.y < 0){
                playerRect.position.y = platform.position.y + platform.height;
            }
            playerRect.physics.velocity.y *= -0.7;
        } else if ( horizonticallyColliding ) {
            debugger;
            if (playerRect.physics.velocity.x > 0) {
                playerRect.position.x = platform.position.x - playerRect.width
            } else if (playerRect.physics.velocity.x < 0){
                playerRect.position.x = platform.position.x + platform.width;
            }
            playerRect.physics.velocity.x *= -0.7;
        }         // const check = (radius: number, position: Point, rect: Rectangle) => {
        //     // Find the closest point to the circle within the rectangle
        //     const closestX = MathUtils.clamp(position.x, rect.position.x, rect.position.x + rect.width);
        //     const closestY = MathUtils.clamp(position.y, rect.position.y, rect.position.y + rect.height);
    
        //     // Calculate the distance between the circle's center and this closest point
        //     const distanceX = position.x - closestX;
        //     const distanceY = position.y - closestY;
    
        //     // If the distance is less than the circle's radius, an intersection occurs
        //     const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
        //     const result = distanceSquared < (radius * radius); 
        //     return result;
        // }

        // if (check(circle.radius, nextPositionX, platform)) {
        //     if (circle.physics.velocity.x > 0) {
        //         console.log("left");
        //         circle.position.x = platform.position.x - circle.radius - 5
        //     } else if (circle.physics.velocity.x < 0){
        //         circle.position.x = platform.position.x + platform.width + circle.radius + 5;
        //         console.log("right");
        //     }
        //     circle.physics.velocity.x *= -0.7;
        // }
        // if (check(circle.radius, nextPositionY, platform)) {
        //     if (circle.physics.velocity.y > 0) {
        //         console.log("top");
        //         circle.position.y = platform.position.y - circle.radius - 5;
        //     } else if (circle.physics.velocity.y < 0){
        //         console.log("bottom");
        //         circle.position.y = platform.position.y + platform.height + circle.radius + 5;
        //     }
        //     circle.physics.gravityEnabled = false;
        //     circle.physics.velocity.y *= -0.7;
        // } else {
        //     circle.physics.gravityEnabled = true;
        // }
    }

    private handlePlayerPlaftformsCollision() {
        const player = this.player;
        if (player) {
            this.platforms.forEach(platform => {
                this.handleCollision(platform);
            })
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

        platform.collision.noclip = true;
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
