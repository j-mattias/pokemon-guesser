import React from "react";

import { PokemonClient } from "pokenode-ts";

import ListGlowItemBorders from "../components/ListGlowItemBorders";
import PokemonCard from "../components/PokemonCard";
import Pagination from "../components/Pagination";
import { extractPokemonId, padStartId } from "@/utils/helpers";
import { IPokemonBasic } from "@/utils/interfaces";

import "./page.css";

const LIMIT = 40;
const POKEMON_MAX_COUNT = 1025;

export default async function PokedexPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    // Get the current page from search params
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    console.log("searchParams: ", page);

    // Calculate the offset for fetching pokemon
    let offset: number = (currentPage - 1) * LIMIT || 0;
    // Prevent offset from getting pokemon beyond the max count
    // Max allowed offset is currently 985, since offset starts at 0, and max count is 1025
    if (offset + LIMIT > POKEMON_MAX_COUNT) {
        offset = POKEMON_MAX_COUNT - LIMIT;
    }
    console.log("offset", offset);

    const pokemonApi = new PokemonClient();

    const pokemonList = await pokemonApi.listPokemons(offset, LIMIT);
    console.log(pokemonList);

    // Calculate the amount of pages needed to display all pokemon (with available images) in the list
    const pages = Math.ceil(POKEMON_MAX_COUNT / LIMIT);

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
            <Pagination pages={pages} currentPage={currentPage} />
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
