import { Subject } from "rxjs";
import { Color } from "../../utils";
import { Point } from "../Point";
import { Vector2D } from "../Vector2D";
import { Circle } from "./Circle";
import { Square } from "./Square";
import { Rectangle } from "./Rectangle";
import { MainLoop } from "../../MainLoop";
import { GameObject, DrawConfiguration } from "../../GameObject";

export type ShapeType = typeof Circle | typeof Square | typeof Rectangle;

export abstract class Shape extends GameObject {
    public onBoundaryCollision$ = new Subject<void>();
    public controls: null | (() => void) = null;
    
    public isColliding = false;
    public indicateCollision = true;

    public checkBoundaries = true;
    public gravityEnabled = false;

    public mass = 1;
    public gravitationSources: Circle[] = [];
    public velocity = new Vector2D(0, 0);
    public acceleration = new Vector2D(0,0);

    protected gravityVector = new Vector2D(0, 0);
    
    private defaultGravity = new Vector2D(0, 0.1);
    private creationFill: Color;
    private creationStroke: Color;

    constructor(
        public position: Point,
        mainLoop: MainLoop,
        drawConfiguration: DrawConfiguration
    ) {
        super(mainLoop, drawConfiguration);
        this.creationFill = drawConfiguration.fillColor; 
        this.creationStroke = drawConfiguration.strokeColor; 
    }


    public abstract centerArountPoint(point: Point): void;
    protected abstract drawShape(delta: number): void;
    protected abstract updateShape(delta: number): void;
    protected abstract gravitateTo(circle: Circle): Vector2D;

    public update(delta: number) {
        if (this.gravityEnabled) {
            this.gravityVector = this.computeGravity();
            this.velocity.add(this.gravityVector);
        } 
        
        if (this.controls && typeof this.controls === "function") {
            this.controls();
        }

        this.velocity.add(this.acceleration);
        this.move(this.velocity);
        this.updateShape(delta);
    }

    public draw(delta: number) {
        if (this.indicateCollision) {
            if (this.collisionObjects.length > 0) {
                this.setColor(Color.RED);
            } else {
                this.setColor(this.creationFill, this.creationStroke);
            }
        }
        this.drawShape(delta);
    }

    public move(vector: Vector2D) {
        const newPosition = Point.add(this.position, vector.point)
        this.position = newPosition;
    }

    private computeGravity(): Vector2D {
        let gravity = new Vector2D(0, 0);
        if (this.gravitationSources.length > 0) {
            for (const gravitationSource of this.gravitationSources) {
                gravity.add(this.gravitateTo(gravitationSource));
            }
        } else {
            const mass = this.mass / 50;
            gravity = Vector2D.scaled(this.defaultGravity, mass);
        }

        return gravity;
    }
}