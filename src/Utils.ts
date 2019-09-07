import { MathUtils } from "./Engine/utils/MathUtils";

export function executeRandomly(functionsArray: Function[]) {
    const length = functionsArray.length;
    const randomIndex = MathUtils.randomInt(0, length -1);
    const randomFunction = functionsArray[randomIndex];
    if (randomFunction) {
        randomFunction();
    }
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