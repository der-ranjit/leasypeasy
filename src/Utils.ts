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