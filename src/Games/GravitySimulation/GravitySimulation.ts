import { Subject, fromEvent } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { MainLoop, DrawConfiguration } from "../../Engine";
import { Color, MathUtils } from "../../Engine/utils";
import { Circle, Vector2D, Point } from "../../Engine/Geometry";
import { Game } from "../Game.abstract";

export class GravitySimulation extends Game {
    public name = "gravity b1tches";
    public started = false;

    private destroyed$ = new Subject<void>();

    private circles: Circle[] = [];
    private gravitationSources: Circle[] = [];

    constructor(mainLoop: MainLoop) {
        super(mainLoop);
    }

    public start() {
        this.mainScript();
        this.started = true;
    }

    public destroy() {
        this.destroyed$.next();
        for (const item of [...this.circles, ...this.gravitationSources]) {
            item.destroy();
        }
        this.circles = [];
        this.gravitationSources = [];
        this.started = false;
    }

    private mainScript() {
        this.canvas.width = 1200;
        this.canvas.height = 600;

        const gravityRadius = 30;
        const offset = gravityRadius / 2;
        const gravitySourceA = new Circle(
            new Point(
                600,
                this.canvas.height / 2 - offset
            ),
            gravityRadius,
            this.mainLoop,
            new DrawConfiguration()
        );
        gravitySourceA.mass = 1000;
        this.gravitationSources.push(gravitySourceA)


        let showStats = false;
        let gravityEnabled = true;
        let useGravitationSource = true;
        let showVelocityIndicator = true;

        const speedVector = new Vector2D(0,0);
        let speed = 0;
        const circleControls = (circle: Circle) => {
            const left = "ArrowLeft";
            const up = "ArrowUp";
            const right = "ArrowRight";
            const down = "ArrowDown";
            
            // renderer.context.strokeText(`(${speedVector.x}, ${speedVector.y})`, 100, 100);
            // renderer.context.strokeText(`${speed}`, 100, 150);
        
            if (this.controls.isKeyPressed(left)) {
                circle.velocity.rotate(-4);;
            }
            if (this.controls.isKeyPressed(right)) {
                circle.velocity.rotate(4);
            }

            speedVector.copy(circle.velocity).setLength(Math.abs(speed / 15));
            const currentLength = circle.velocity.getLength();
            if (this.controls.isKeyPressed(down)) {
                const deccelerate = 0.2;
                speed -= deccelerate;
                circle.velocity.add(speedVector.scale(-2));
            }
            if (this.controls.isKeyPressed(up)) {
                const accelerate = 0.2;
                speed += accelerate;
                circle.velocity.add(speedVector);
            }
            const frictionFactor = 0.9;
            speed = speed * frictionFactor;
            if (Math.abs(speed) <= 0.1) {
                speed = 0;
            }
        }

        const addCircle = (position: Point) => {
            const circle = new Circle(
                position,
                15,
                this.mainLoop,
                new DrawConfiguration(Color.RANDOM_COLOR, Color.RANDOM_COLOR)
            );
            circle.controls = () => circleControls(circle);
            circle.mass = 150;
            circle.onBoundaryCollision$.pipe(takeUntil(this.destroyed$)).subscribe(_ =>  circle.velocity.scale(0.7));
            circle.gravitationSources.push(...this.gravitationSources, ...this.circles);
            this.circles.forEach(_circle => _circle.gravitationSources.push(circle));
            circle.gravityEnabled = gravityEnabled;
            circle.showVelocityIndicator = showVelocityIndicator;
            circle.showStats = showStats;
            const speed = MathUtils.randomInt(1, 5);
            const angle = MathUtils.degreesToRadian(MathUtils.randomInt(1, 360));
            circle.velocity.setLength(speed);
            circle.velocity.setAngle(angle);
            this.circles.push(circle);
        }
        
        fromEvent<MouseEvent>(window, "click").pipe(takeUntil(this.destroyed$)).subscribe(event => {
            addCircle(new Point(event.clientX, event.clientY));
        }) 

        this.controls.onKeyDown(" ").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            for (const circle of this.circles) {
                circle.velocity.add(new Vector2D(0, -10));
            }
        });

        this.controls.onKeyDown("a").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            const randomX = MathUtils.randomInt(20, this.mainLoop.context.canvas.width - 20);
            const randomY = MathUtils.randomInt(20, this.mainLoop.context.canvas.height - 20);
            addCircle(new Point(randomX, randomY));
        });
        
        this.controls.onKeyDown("b").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            useGravitationSource = !useGravitationSource
            this.circles.forEach(circle => {
                if (useGravitationSource) {
                    circle.gravitationSources.push(...this.gravitationSources);
                } else {
                    circle.gravitationSources = [];
                }
            });
        });

        this.controls.onKeyDown("i").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            showStats = !showStats;
            this.circles.forEach(circle => circle.showStats = showStats);
        });

        this.controls.onKeyDown("g").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            gravityEnabled = !gravityEnabled;
            this.circles.forEach(circle => circle.gravityEnabled = gravityEnabled);
        });
        
        this.controls.onKeyDown("d").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            showVelocityIndicator = !showVelocityIndicator
            this.circles.forEach(circle => circle.showVelocityIndicator = showVelocityIndicator);
        });
        
        this.controls.onKeyDown("r").pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            this.circles.forEach(circle => circle.destroy());
            this.circles.splice(0, this.circles.length);
        });
    }
}