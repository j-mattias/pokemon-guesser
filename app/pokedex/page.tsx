import React from "react";

import { MainClient } from "pokenode-ts";

import ListGlowItemBorders from "../components/ListGlowItemBorders";
import PokemonCard from "../components/PokemonCard";
import Pagination from "../components/Pagination";
import FilterGeneration from "../components/FilterGeneration";
import { addIdsToPokemonList } from "@/utils/helpers";
import { IPokemonBasic } from "@/utils/interfaces";

import "./page.css";

const LIMIT = 40;
const POKEMON_MAX_COUNT = 1025;

export default async function PokedexPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; gen?: string }>;
}) {
    const { page, gen } = await searchParams;

    // Initialize pokemon client
    const pokemonApi = new MainClient();

    // Fetch list of pokemon generations for filter component
    const pokemonGenerations = await pokemonApi.game.listGenerations();
    console.log(pokemonGenerations);

    const currentPage = Number(page) || 1;
    console.log("searchParams: ", page);

    // Calculate the offset for fetching pokemon
    let offset: number = (currentPage - 1) * LIMIT || 0;
    console.log("offset", offset);

    // Initialize a list to store pokemon data and pages for pagination
    let pokemonList: IPokemonBasic[] = [];
    let pages: number = 0;

    // If there's a generation searchParam, fetch pokemon list by generation id
    // Otherwise fetch a paginated list of all pokemon
    if (gen && Number(gen) <= pokemonGenerations.count) {
        const data = await pokemonApi.game.getGenerationById(Number(gen));
        console.log("fetch genById: ", data);

        // Calculate the end for pagination, as the whole list of pokemon
        // gets fetched for generations
        const end =
            LIMIT + offset < data.pokemon_species.length
                ? LIMIT + offset
                : data.pokemon_species.length;

        const modifiedPokemonList = addIdsToPokemonList(data.pokemon_species);

        // Sort the generation list by id (comes unsorted)
        const sortedList = modifiedPokemonList.sort((a, b) => a.id - b.id);

        // Set the results to show for a specified page
        pokemonList = sortedList.slice(offset, end);
        console.log("gen list", pokemonList);

        // Calculate the amount of pages needed to display all pokemon in given generation
        pages = Math.ceil(sortedList.length / LIMIT);
    } else {
        // Prevent offset from getting pokemon beyond the max count
        // Max allowed offset is currently 985, since offset starts at 0, and max count is 1025
        if (offset + LIMIT > POKEMON_MAX_COUNT) {
            offset = POKEMON_MAX_COUNT - LIMIT;
        }
        // Fetch LIMIT pokemon at a time
        const data = await pokemonApi.pokemon.listPokemons(offset, LIMIT);

        // Set the results to show for a specified page
        pokemonList = addIdsToPokemonList(data.results);
        console.log("all list: ", pokemonList);

        // Calculate the amount of pages needed to display all pokemon
        // (with available images) in the list
        pages = Math.ceil(POKEMON_MAX_COUNT / LIMIT);
    }

    return (
        <main id="pokedex-page">
            <h1 className="pokedex-page__title">Pokedex</h1>
            <FilterGeneration generations={pokemonGenerations.results} />
            <ListGlowItemBorders
                list={pokemonList}
                cardComponent={PokemonCard}
                itemStyles={itemStyles}
            />
            {pages > 1 && <Pagination pages={pages} currentPage={currentPage} />}
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
