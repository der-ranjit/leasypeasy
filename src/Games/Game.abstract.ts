import { Renderer, Controls } from "../Engine";

export abstract class Game {
    
    public context = this.renderer.context;
    public canvas = this.renderer.context.canvas;
    public controls = Controls.getInstance();
    
    constructor(public renderer: Renderer) {
        
    }

    public abstract start(): void;
    public abstract destroy(): void;
} 