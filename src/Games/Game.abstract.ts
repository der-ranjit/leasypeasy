import { Renderer } from "../Engine";
import { Controls } from "../Engine/utils";

export abstract class Game {
    public abstract name: string;
    public abstract started: boolean;
    public context = this.renderer.context;
    public canvas = this.renderer.context.canvas;
    public controls = Controls.getInstance();
    
    constructor(public renderer: Renderer) {
        
    }

    public abstract start(): void;
    public abstract destroy(): void;
} 