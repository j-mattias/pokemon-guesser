import { NamedAPIResource } from "pokenode-ts";
import { IPokemonBasic } from "./interfaces";

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

// Add id and paddedId to each pokemon object and store it in a new list
export function addIdsToPokemonList(pokemonList: NamedAPIResource[]): IPokemonBasic[] {
    return pokemonList.map((pokemon) => {
        const id = extractPokemonId(pokemon.url);
        const paddedId = padStartId(id);
        return { ...pokemon, id, paddedId };
    });
}
