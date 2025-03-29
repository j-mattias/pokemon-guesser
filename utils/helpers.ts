// Randomize a number between min and max
export function randomizeNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Extract the id from a pokeApi url
export function extractPokemonId(url: string): number {
    const idRegex = /(\d+)\/$/;
    const id = Number(url.match(idRegex)?.[1]);
    return id;
}

// Pad the start of an id and return it as a string
export function padStartId(id: number): string {
    return id.toString().padStart(3, "0");
}