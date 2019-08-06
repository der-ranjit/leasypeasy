export class Renderer {
    static INSTANCE;

    constructor() {
        this.start();
    }

    renderObjects = [];
    started = false;
    lastRenderTS = 0;

    static getInstance() {
        if (!Renderer.INSTANCE) {
            Renderer.INSTANCE = new Renderer();
        } 
        return Renderer.INSTANCE;
    }

    start() {
        this.started = true;
        this.lastRenderTS = Date.now();
        this.loop();
    }

    stop() {
        this.started = false;
    }

    addRenderObject(renderObject) {
        this.renderObjects.push(renderObject);
    }

    loop() {
        if (this.started) {
            requestAnimationFrame(() => {
                const delta = Date.now() - this.lastRenderTS;
                for (const object of this.renderObjects) {
                    object.update(delta);
                    object.draw(delta);
                }
                this.lastRenderTS = Date.now();
                this.loop();
            });
        }
    }
}