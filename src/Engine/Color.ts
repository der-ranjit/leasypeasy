import { clamp } from "../Utils";

export class Color {
    public static RED = new Color(255, 0, 0);
    public static GREEN = new Color(0, 255, 0);
    public static BLUE = new Color(0, 0, 255);
    public static WHITE = new Color(255, 255, 255);
    public static BLACK = new Color(0, 0, 0);
    public static GREY = new Color(127, 127, 127);
    
    public static YELLOW = Color.add(Color.RED, Color.GREEN);

    public static mix(color1: Color, color2: Color, mixAmount = 0.5): Color {
        const r = clamp(0, 255, color1.r * mixAmount + color2.r * (1 - mixAmount));
        const g = clamp(0, 255, color1.g * mixAmount + color2.g * (1 - mixAmount));
        const b = clamp(0, 255, color1.b * mixAmount + color2.b * (1 - mixAmount));

        return new Color(r, g, b);
    }

    public static add(color1: Color, color2: Color): Color {
        const r = clamp(0, 255, color1.r + color2.r);
        const g = clamp(0, 255, color1.g + color2.g);
        const b = clamp(0, 255, color1.b + color2.b);
        console.log(r,g, b);
        return new Color(r, g, b);
    }

    constructor(
        public r: number,
        public g: number,
        public b: number
    ) {

    }

    public toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`
    }
}