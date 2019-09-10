import { Color, Common } from "./utils";
import { MainLoop } from "./MainLoop";
import { Vector2D, Point } from "./Geometry";
import { Shape } from "./Geometry/Shapes/Shape";

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
    constructor(
        public gravityEnabled = false,
        public mass = 1,
        public gravitationSources: Shape[] = [],
        public velocity = new Vector2D(0, 0),
        public acceleration = new Vector2D(0,0),
        public gravityVector = new Vector2D(0, 0),
        public defaultGravity = new Vector2D(0, 0.1)
    ) {
    }
}

export class CollisionConfiguration {
    public collisions: GameObject[] = [];
    public isColliding = false;

    constructor(
        public checkBoundaries = true,
        public indicateCollision = false,
        public noclip = false
    ) {
    }
}

export abstract class GameObject {
    /* unique id for the GameObject */
    public readonly id: string;

    public collision = new CollisionConfiguration();
    public physics = new PhysicsConfiguration();
    
    constructor(
        protected mainLoop: MainLoop,
        public drawConfiguration: DrawConfiguration,
        public position: Point
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

    public move(vector: Vector2D) {
        const newPosition = Point.add(this.position, vector.point)
        this.position = newPosition;
    }

    public destroy() {
        this.mainLoop.removeGameObject(this);
    }
}