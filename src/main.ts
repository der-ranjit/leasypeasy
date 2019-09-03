import { Renderer } from "./Engine/Renderer";

import { LisiColors } from "./Games/LisiColors/LisiColors";
import { LisiCollision } from "./Games/LisiCollision/LisiCollision";
import { GravitySimulation } from "./Games/GravitySimulation/GravitySimulation";
import { mixinTest } from "./Games/mixinTest";
import { Shooter } from "./Games/Shooter/Shooter";
import { Controls } from "./Engine";
import { Platformer } from "./Games/Platformer/Platformer";
import { Game } from "./Games/Game.abstract";

const main = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
            const renderer = new Renderer(context);
            const controls = Controls.getInstance();
            
            // LisiColors(renderer);
            // LisiCollision(renderer);
            // GravitySimulation(renderer);
            // mixinTest(renderer.context);
            // Shooter(renderer);
            const games = [
                new Platformer(renderer),
                new GravitySimulation(renderer)
            ];
            
            let activeGameIndex = 0;
            let activeGame: Game | null = games[activeGameIndex];

            // start selected game
            controls.onKeyDown("Enter").subscribe(_ => {
                if (activeGame) {
                    activeGame.start();
                }
            })
            // stop active game
            controls.onKeyDown("Escape").subscribe(_ => {
                if (activeGame) {
                    activeGame.destroy();
                    activeGameIndex = (activeGameIndex + 1) % games.length;
                    activeGame = games[activeGameIndex];
                }
            })
            // pause
            controls.onKeyDown("p").subscribe(_ => {
                renderer.isRunning ? renderer.pause() : renderer.unpause();
            });
        }
    }
}

window.onload = () => {
    main();
}
