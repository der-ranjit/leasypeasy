import { Circle } from "../Engine/Shapes";
import { Vector2D } from "../Engine/Vector2D";
import { Color, Controls, Point, Renderer, Collision } from "./../Engine";
import { Subject } from "rxjs";

interface PlayerControls {
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

class Player {
    public readonly onHit$ = new Subject<Player>();
    public readonly opponents: Player[] = [];
    public score = 0;
    public circle: Circle;
    
    private playerRadius = 20;
    
    private bullets: Circle[] = [];
    private bulletRadius = 5;
    private bulletSpeed = 4;

    private controls = Controls.getInstance();

    constructor(
        public name: string,
        public startPosition: Point,
        public playerColor: Color,
        public bulletColor: Color,
        private renderer: Renderer,
        playerControls = defaultControls
    ) {
        this.circle = new Circle(startPosition, this.playerRadius, this.renderer, this.playerColor)
        this.circle.showVelocityIndicator = true;
        this.circle.isControlled = true; 

        this.setControlScheme(playerControls);

        this.renderer.onBeforeUpdate$.subscribe(_ => {
            this.checkOppenentsHit();
        })

    }

    public shoot() {
        let bullet = this.createBullet();
        this.bullets.push(bullet);
    }

    private createBullet() {
        let bullet = new Circle(this.circle.position, this.bulletRadius, this.renderer, this.bulletColor);
        bullet.velocity = Vector2D.from(this.circle.velocity).setLength(this.bulletSpeed);
        bullet.onBoundaryCollision$.subscribe(_ => {
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
            if (Collision.isColliding(bullet, player.circle)) {
                this.onHit$.next(player);
                this.destroyBullet(bullet);
            }
        });
    }

    private setControlScheme(controls: PlayerControls) {
        this.circle.up = controls.up;
        this.circle.down = controls.down;
        this.circle.left = controls.left;
        this.circle.right = controls.right;
        this.controls.onKeyDown(controls.shoot).subscribe(_ => {
            this.shoot();
        });
    }
}

export const Shooter = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    canvas.width = 1200;
    canvas.height = 600;

    const controls = Controls.getInstance();
    
    const lisiPosition = new Point(20, canvas.height / 2);
    const lisiControls: PlayerControls = {
        left: "a",
        up: "w",
        right: "d",
        down: "s",
        shoot: "q"
    };
    const ranzPosition = new Point(canvas.width - 20, canvas.height / 2);

    const ranz = new Player("Ranz", ranzPosition, Color.BLACK, Color.RED, renderer);
    const lisi = new Player("Lisi", lisiPosition, Color.MAGENTA, Color.GREEN, renderer, lisiControls);
    ranz.opponents.push(lisi);
    lisi.opponents.push(ranz);
    
    const players = [ranz, lisi];
    players.forEach(player => {
        player.onHit$.subscribe(hitPlayer => {
            player.score++;
            player.circle.radius = player.circle.radius + 1;
            hitPlayer.circle.radius = hitPlayer.circle.radius - 1;
        });
    })

    renderer.onLoopEnd$.subscribe(_ => {
        const winningScore = 20;
        players.forEach((player, index) => {
            renderer.context.strokeText(`count ${player.name}: ${player.score}`, 1100, 50 + 50 * index);
            if (player.score === winningScore) {
                renderer.pause();
                renderer.context.strokeText(`${player.name} hat große Balls`, 600, 300);
            }
        })
    });
}