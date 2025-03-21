// Randomize a number between min and max
export function randomizeNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
