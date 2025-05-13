import { NamedAPIResource } from "pokenode-ts";
import { IPokemonBasic } from "./interfaces";
import { TypeColorKeys } from "./types";
import { typeColors } from "@/data/typeColors";

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

// Add id, paddedId and href to each pokemon object and store it in a new list
export function modifyPokemonList(pokemonList: NamedAPIResource[], basePath: string): IPokemonBasic[] {
    return pokemonList.map((pokemon) => {
        const id = extractPokemonId(pokemon.url);
        const paddedId = padStartId(id);
        const href = basePath + "/" + pokemon.name;
        const newName = replaceCharWithSpace(pokemon.name, "-");
        
        return { ...pokemon, id, paddedId, href, name: newName };
    });
}

// Replaces specified character(s) with a space
export function replaceCharWithSpace(str: string, char: string) {
    return str.split(char).join(" ");
}

// Get the color for a specific pokemon type
export function getTypeColor(key: string) {
    if (key in typeColors) {
        return typeColors[key as TypeColorKeys];
    }
    return "#7f7f7f";
}

// Validate integer value
export function validateInt(num: number): boolean {
    if (typeof num !== "number" || Number.isNaN(num) || !Number.isInteger(num)) {
        return false;
    }
    return true;
}

// Only display console.log if debug = true
export function debugLog<T>(logMsg: string | Error, ...args: T[]) {
    const isDebug = process.env.NEXT_PUBLIC_DEBUG === "true";
    if (isDebug) {
        console.log(`[DEBUG] ${logMsg}`, ...args)
    }
}