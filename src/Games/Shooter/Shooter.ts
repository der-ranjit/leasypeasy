import { Color, Controls, Point, Renderer } from "../../Engine";
import { PlayerControls, Player } from "./Player";

export const Shooter = (renderer: Renderer) => {
    const canvas = renderer.context.canvas;
    const controls = Controls.getInstance();
    
    canvas.width = 1200;
    canvas.height = 600;

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