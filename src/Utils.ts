export function isEven(number: number) {
    return number % 2 === 0;
}

export function executeRandomly(functionsArray: Function[]) {
    const length = functionsArray.length;
    const randomIndex = Math.floor(Math.random() * length);
    const randomFunction = functionsArray[randomIndex];
    if (randomFunction) {
        randomFunction();
    }
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

export function debounce(func: Function, time: number) {
    let lastCall = 0;
    return function (...args: any[]) {
      const now = (new Date).getTime();
      if (now - lastCall < time) {
        return;
      }
      lastCall = now;
      return func(...args);
    }
}