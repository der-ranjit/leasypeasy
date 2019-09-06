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
            
            let selectedGameIndex = 0;
            let activeGame: Game | null = null;

            renderer.onLoopEnd$.subscribe(_ => {
                if (!activeGame) {
                    games.forEach((game, i) => {
                        renderer.context.strokeText((game === games[selectedGameIndex] ? '>' : '') + game.name, 100, 50 + 30 * i);
                    });
                }
            })

            controls.onKeyDown("ArrowUp").subscribe(_ => {
                if(activeGame) {
                    return;
                }
                selectedGameIndex = selectedGameIndex - 1;
                if (selectedGameIndex < 0) {
                    selectedGameIndex = games.length - 1;
                }
            })
            controls.onKeyDown("ArrowDown").subscribe(_ => {
                if(activeGame) {
                    return;
                }
                selectedGameIndex = (selectedGameIndex + 1) % games.length;
            })
            // start selected game
            controls.onKeyDown("Enter").subscribe(_ => {
                if(activeGame) {
                    return;
                }
                const newGame = games[selectedGameIndex];
                if (newGame && !newGame.started) {
                    newGame.start();
                    activeGame = newGame; 
                }
            })
            // stop active game
            controls.onKeyDown("Escape").subscribe(_ => {
                if (!activeGame){
                    return;
                }
                if (activeGame) {
                    activeGame.destroy();
                    activeGame = null;
                    renderer.removeAllRenderObjects();
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
