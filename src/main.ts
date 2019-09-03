import { Renderer } from "./Engine/Renderer";

import { LisiColors } from "./Games/LisiColors/LisiColors";
import { LisiCollision } from "./Games/LisiCollision/LisiCollision";
import { GravitySimulation } from "./Games/GravitySimulation/GravitySimulation";
import { mixinTest } from "./Games/mixinTest";
import { Shooter } from "./Games/Shooter/Shooter";
import { Controls } from "./Engine";
import { Platformer } from "./Games/Platformer/Platformer";

const main = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
            const renderer = new Renderer(context);
            const controls = Controls.getInstance();
            controls.onKeyDown("p").subscribe(_ => {
                renderer.isRunning ? renderer.pause() : renderer.unpause();
            });
            
            // LisiColors(renderer);
            // LisiCollision(renderer);
            // GravitySimulation(renderer);
            // mixinTest(renderer.context);
            // Shooter(renderer);
            Platformer(renderer);
        }
    }
}

window.onload = () => {
    main();
}
