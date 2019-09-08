import { Color, Common } from "./utils";
import { MainLoop } from "./MainLoop";

export class DrawConfiguration {
    constructor(
        public fillColor = Color.BLACK,
        public strokeColor = Color.BLACK,
        public lineWidth = 1,
        public zIndex = 1 ,
        public drawn = true
    ) {
    }
}

export class PhysicsConfiguration {
    
}

export class CollisionConfiguration {
    public collisionObjects: GameObject[] = [];
    public isColliding = false;

    constructor(
        public checkBoundaries = true,
        public indicateCollision = true
    ) {
    }
}

export abstract class GameObject {
    /* unique id for the GameObject */
    public readonly id: string;

    public collisionConfiguration = new CollisionConfiguration();
    public physics = new PhysicsConfiguration();
    
    constructor(
        protected mainLoop: MainLoop,
        public drawConfiguration: DrawConfiguration
    ) {
        this.mainLoop.addGameObject(this);
        this.id = Common.createUniqueId();
    }

    public abstract update(delta: number): void;
    public abstract draw(delta: number): void; 

    protected get context() {
        return this.mainLoop.context;
    } 

    public setColor(fillAndStrokeColor: Color): void;
    public setColor(fillColor: Color, strokeColor: Color): void;
    public setColor(fillColor: Color, strokeColor?: Color) {
        let stroke = fillColor;
        if (strokeColor) {
            stroke = strokeColor;
        } 
        this.drawConfiguration.fillColor = fillColor;
        this.drawConfiguration.strokeColor = stroke; 
    }

    public destroy() {
        this.mainLoop.removeGameObject(this);
    }
}