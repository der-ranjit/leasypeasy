import { Renderer, Controls, Point, Color } from "../../Engine";
import { PlayerControls, Player } from "../Shooter/Player";
import { Game } from "../Game.abstract";
import { Subject } from "rxjs";

export class Platformer extends Game {
    private destroyed$ = new Subject<void>();

    private players: Player[] = [];

    constructor(renderer: Renderer) {
        super(renderer);
    }

    public start() {
        this.mainScript();
    }

    private mainScript() {
        this.canvas.width = 1200;
        this.canvas.height = 600;
    
        const lisiPosition = new Point(20, this.canvas.height / 2);
        const lisiControls: PlayerControls = {
            left: "a",
            up: "w",
            right: "d",
            down: "s",
            shoot: "q"
        };
        const ranzPosition = new Point(this.canvas.width - 20, this.canvas.height / 2);
    
        const ranz = new Player("Ranz", ranzPosition, Color.BLACK, Color.RED, this.renderer);
        // ranz.circle.gravityEnabled = true;
        this.players.push(ranz);
    }

    public destroy() {
        for (const player of this.players) {
            player.destroy();
        } 
        this.players = [];
        this.destroyed$.next();
    }
}