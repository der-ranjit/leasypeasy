export function isEven(num) {
    return num % 2 === 0;
}

export function executeRandomly(functionsArray) {
    const length = functionsArray.length;
    const randomIndex = Math.floor(Math.random() * length);
    const randomFunction = functionsArray[randomIndex];
    if (randomFunction) {
        randomFunction();
    }
}