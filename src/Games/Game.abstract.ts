import { MainLoop } from "../Engine";
import { Controls } from "../Engine/utils";

export abstract class Game {
    public abstract name: string;
    public abstract started: boolean;
    public context = this.mainLoop.context;
    public canvas = this.mainLoop.context.canvas;
    public controls = Controls.getInstance();
    
    constructor(public mainLoop: MainLoop) {
        
    }

    public abstract start(): void;
    public abstract destroy(): void;
} 