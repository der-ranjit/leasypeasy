import { Renderer } from "./Engine/Renderer";

import { LisiColors } from "./Games/LisiColors/LisiColors";
import { LisiCollision } from "./Games/LisiCollision/LisiCollision";
import { GravityDemo } from "./Games/GravityDemo";
import { mixinTest } from "./Games/mixinTest";
import { Shooter } from "./Games/Shooter/Shooter";
import { Controls } from "./Engine";

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
            // GravityDemo(renderer);
            // mixinTest(renderer.context);
            Shooter(renderer);
        }
    }
}

window.onload = () => {
    main();
}
