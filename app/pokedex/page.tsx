import React from "react";

import { PokemonClient } from "pokenode-ts";

import PokemonList from "../components/PokemonList";

import "./page.css";

export default async function PokedexPage() {
    const pokemonApi = new PokemonClient();

    const pokemonList = await pokemonApi.listPokemons();
    console.log(pokemonList);

    return (
        <main id="pokedex-page">
            <h1 className="pokedex-page__title">Pokedex</h1>
            <PokemonList pokemonList={pokemonList.results} />
        </main>
    );
}
