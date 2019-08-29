export namespace MathUtils {
    export function isEven(number: number) {
        return number % 2 === 0;
    }
    
    export function randomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    } 
    
    export function clamp(min: number, max: number, value: number): number {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }
    
    export function inRange(value: number, rangeStart: number, rangeEnd: number): boolean {
        return value >= Math.min(rangeStart, rangeEnd) &&
               value <= Math.max(rangeStart, rangeEnd); 
    }
    
    export function rangesIntersect(rangeAstart: number, rangeAEnd: number, rangeBStart: number, rangeBEnd: number): boolean {
        /* The first range's largest value has to be greater than the second range's smallest value and
           the first range's smallest value hast to be smaller than the second range's largest value
           for an intersection to occur */
        return Math.max(rangeAstart, rangeAEnd) >= Math.min(rangeBStart, rangeBEnd) &&
               Math.min(rangeAstart, rangeAEnd) <= Math.max(rangeBStart, rangeBEnd)
    }

    export function radianToDegrees(radian: number) {
        const degrees = radian * 180 / Math.PI; 
        return normalizeAngle(degrees);
    }

    export function degreesToRadian(degrees: number) {
        return normalizeAngle(degrees) * Math.PI / 180;
    }

    /**
     * Make sure the angle stays within 0-360 and is positive
     */
    export function normalizeAngle(degrees: number) {
        degrees %= 360;
        if (degrees < 0 ) {
            degrees += 360;
        }
        return degrees;
    }
}