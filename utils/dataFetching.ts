import { MainClient } from "pokenode-ts";

const pokeApi = new MainClient();

// Fetch pokemon by id
export async function fetchPokemonById(id: number) {
    try {
        const pokemon = await pokeApi.pokemon.getPokemonById(id);
        console.log("fetchPokemonById: ", pokemon);
        return pokemon;
    } catch (error) {
        throw new Error(`Failed to fetch pokemon with id: ${id}`);
    }
}

// Fetch pokemon by name
export async function fetchPokemonByName(name: string) {
    try {
        const pokemon = await pokeApi.pokemon.getPokemonByName(name);
        console.log("fetchPokemonByName: ", pokemon);
        return pokemon;
    } catch (error) {
        throw new Error(`Failed to fetch pokemon with name: ${name}`);
    }
}

// Fetch a list of generations
export async function fetchGenerations() {
    try {
        const genList = await pokeApi.game.listGenerations();
        console.log("fetchGenerations: ", genList);
        return genList;
    } catch (error) {
        throw new Error("Failed to fetch list of generations.");
    }
}

// Fetch a generation of pokemon by id
export async function fetchGenerationById(genId: number) {
    try {
        const generation = await pokeApi.game.getGenerationById(genId);
        console.log("fetchGenerationById: ", generation);
        return generation;
    } catch (error) {
        throw new Error(`Failed to fetch list of pokemon for generation: ${genId}.`);
    }
}

// Fetch a list of all pokemon
export async function fetchPokemonList(offset: number, limit: number) {
    try {
        const pokemonList = await pokeApi.pokemon.listPokemons(offset, limit);
        console.log("fetchPokemonList: ", pokemonList);
        return pokemonList;
    } catch (error) {
        throw new Error(`Failed to fetch list of all pokemon.`);
    }
}
