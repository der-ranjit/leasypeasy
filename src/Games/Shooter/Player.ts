import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { MainLoop, DrawConfiguration } from "../../Engine";
import { CollisionDetector } from "../../Engine/Collision";
import { Color, Controls } from "../../Engine/utils";
import { Circle } from "../../Engine/Geometry/Shapes/Circle";
import { Point } from "../../Engine/Geometry/Point";
import { Vector2D } from "../../Engine/Geometry/Vector2D";

export interface PlayerControls {
    up: string;
    down: string;
    left: string;
    right: string;
    shoot: string;
}

const defaultControls: PlayerControls = {
    left: "ArrowLeft",
    up: "ArrowUp",
    right: "ArrowRight",
    down: "ArrowDown",
    shoot: " "
}

export class Player {
    public readonly onHit$ = new Subject<Player>();
    public opponents: Player[] = [];
    public score = 0;
    public circle: Circle;
    
    private playerRadius = 20;
    
    private bullets: Circle[] = [];
    private bulletRadius = 5;
    private bulletSpeed = 4;

    private destroyed$ = new Subject<void>();

    private controls = Controls.getInstance();

    constructor(
        public name: string,
        public startPosition: Point,
        public playerColor: Color,
        public bulletColor: Color,
        private mainLoop: MainLoop,
        playerControls = defaultControls
    ) {
        this.circle = new Circle(startPosition, this.playerRadius, this.mainLoop, new DrawConfiguration(
            this.playerColor
        ));
        this.circle.showVelocityIndicator = true;

        this.setControlScheme(playerControls);

        this.mainLoop.onUpdate$.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            this.checkOppenentsHit();
        })
    }

    public shoot() {
        let bullet = this.createBullet();
        this.bullets.push(bullet);
    }

    public destroy() {
        for (const bullet of this.bullets) {
            bullet.destroy();
        }
        this.bullets = [];
        this.opponents = [];
        this.circle.destroy();
        this.destroyed$.next();
    }

    private createBullet() {
        let bullet = new Circle(this.circle.position, this.bulletRadius, this.mainLoop, new DrawConfiguration(
            this.playerColor
        ));
        bullet.physics.velocity = Vector2D.from(this.circle.physics.velocity).setLength(this.bulletSpeed);
        bullet.onBoundaryCollision$.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            this.destroyBullet(bullet);
        })
        return bullet;
    }

    private destroyBullet(bullet: Circle) {
        bullet.destroy();
        const index = this.bullets.indexOf(bullet);
        this.bullets.splice(index, 1);
    }

    private checkOppenentsHit() {
        for(const opponent of this.opponents) {
            this.checkBulletHit(opponent);
        }
    }

    private checkBulletHit(player: Player) {
        this.bullets.forEach(bullet => {
            if (CollisionDetector.isColliding(bullet, player.circle)) {
                this.onHit$.next(player);
                this.destroyBullet(bullet);
            }
        });
    }

    private setControlScheme(controls: PlayerControls) {
        this.circle.controls = () => this.executeControls(controls)
        this.controls.onKeyDown(controls.shoot).pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            this.shoot();
        });
    }

    private executeControls(controls: PlayerControls) {
        const currentLength = this.circle.physics.velocity.getLength();
        if (this.controls.isKeyPressed(controls.left)) {
            this.circle.physics.velocity.rotate(-4);;
        }
        if (this.controls.isKeyPressed(controls.right)) {
            this.circle.physics.velocity.rotate(4);
        }
        if (this.controls.isKeyPressed(controls.down)) {
            const deccelerate = 0.2;
            let newLength = currentLength - deccelerate;
            newLength = (newLength < 0) ? 0 : newLength;
            this.circle.physics.velocity.setLength(newLength);
        }
        if (this.controls.isKeyPressed(controls.up)) {
            const accelerate = 0.1;
            const maxSpeed = 5;
            let newLength = currentLength + accelerate;
            newLength = (newLength > maxSpeed) ? maxSpeed : newLength;
            this.circle.physics.velocity.setLength(newLength);
        }
    }
}
