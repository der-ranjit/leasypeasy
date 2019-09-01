import { Renderer } from "./Engine/Renderer";

import { LisiColors } from "./Games/LisiColors/LisiColors";
import { LisiCollision } from "./Games/LisiCollision/LisiCollision";
import { GravityDemo } from "./Games/GravityDemo";
import { mixinTest } from "./Games/mixinTest";
import { Shooter } from "./Games/Shooter";

const main = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
            const renderer = new Renderer(context);

            // LisiColors(renderer);
            // LisiCollision(renderer);
            GravityDemo(renderer);
            // mixinTest(renderer.context);
            // Shooter(renderer);
        }
    }
}

window.onload = () => {
    main();
}
