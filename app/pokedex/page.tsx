import React from "react";

import { PokemonClient } from "pokenode-ts";

import ListGlowItemBorders from "../components/ListGlowItemBorders";
import PokemonCard from "../components/PokemonCard";
import { extractPokemonId, padStartId } from "@/utils/helpers";
import { IPokemonBasic } from "@/utils/interfaces";

import "./page.css";

export default async function PokedexPage() {
    const pokemonApi = new PokemonClient();

    const pokemonList = await pokemonApi.listPokemons();
    console.log(pokemonList);

    // Add id and paddedId to each pokemon object and store it in a new list
    const modifiedPokemonList: IPokemonBasic[] = pokemonList.results.map((pokemon) => {
        const id = extractPokemonId(pokemon.url);
        const paddedId = padStartId(id);
        return { ...pokemon, id, paddedId };
    });
    console.log(modifiedPokemonList);

    return (
        <main id="pokedex-page">
            <h1 className="pokedex-page__title">Pokedex</h1>
            <ListGlowItemBorders
                list={modifiedPokemonList}
                cardComponent={PokemonCard}
                itemStyles={itemStyles}
            />
        </main>
    );
}

const itemStyles = {
    itemStyle: {
        borderWidth: "1px",
        // borderRadius: "2px",
        borderColor: "rgba(146, 146, 146, 0.1)",
        // blur: "0px",
        // backgroundColor: "rgb(141, 0, 0)",
    },
    radialBackdrop: {
        // size: "500px",
        // color: "rgba(255, 255, 255, 0.04)",
        // falloff: "40%",
        // opacity: "1",
    },
    borderGlow: {
        // size: "500px",
        // color: "rgba(255, 255, 255, 0.4)",
        // falloff: "40%",
        // opacity: "1",
    },
};
