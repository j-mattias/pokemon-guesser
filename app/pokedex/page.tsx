import React from "react";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import ListGlowItemBorders from "../components/ListGlowItemBorders";
import PokemonCard from "../components/PokemonCard";
import Pagination from "../components/Pagination";
import FilterGeneration from "../components/FilterGeneration";
import { addIdsToPokemonList, debugLog } from "@/utils/helpers";
import { IPokemonBasic } from "@/utils/interfaces";
import { POKEMON_MAX_COUNT } from "@/data/globalVariables";
import { fetchGenerationById, fetchGenerations, fetchPokemonList } from "@/utils/dataFetching";

import "./page.css";

export const metadata: Metadata = {
    title: "Pokedex",
    description: "Browse all Pokemon or by specific generation",
};

const LIMIT = 40;

export default async function PokedexPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; gen?: string }>;
}) {
    const { page, gen } = await searchParams;
    const pageNum = Number(page),
        genNum = Number(gen);

    // Fetch list of pokemon generations for filter component
    const pokemonGenerations = await fetchGenerations();

    const currentPage = pageNum || 1;
    debugLog(`searchParams: `, page);

    // Calculate the offset for fetching pokemon
    let offset: number = (currentPage - 1) * LIMIT || 0;
    debugLog(`offset: `, offset);

    // Initialize a list to store pokemon data and pages for pagination
    let pokemonList: IPokemonBasic[] = [];
    let pages: number = 0;

    // If there's a generation searchParam, fetch pokemon list by generation id
    // Otherwise fetch a paginated list of all pokemon
    if (gen && genNum <= pokemonGenerations.count) {
        const data = await fetchGenerationById(genNum);

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
        debugLog(`Gen list: `, pokemonList);

        // Calculate the amount of pages needed to display all pokemon in given generation
        pages = Math.ceil(sortedList.length / LIMIT);
    } else {
        // Prevent offset from getting pokemon beyond the max count
        // Max allowed offset is currently 985, since offset starts at 0, and max count is 1025
        if (offset + LIMIT > POKEMON_MAX_COUNT) {
            offset = POKEMON_MAX_COUNT - LIMIT;
        }
        // Fetch LIMIT pokemon at a time
        const data = await fetchPokemonList(offset, LIMIT);

        // Set the results to show for a specified page
        pokemonList = addIdsToPokemonList(data.results);
        debugLog(`All list: `, pokemonList);

        // Calculate the amount of pages needed to display all pokemon
        // (with available images) in the list
        pages = Math.ceil(POKEMON_MAX_COUNT / LIMIT);
    }

    // Validate searchParams
    if (gen && (genNum > pokemonGenerations.count || genNum < 1)) {
        debugLog(`Not a valid gen.`);
        notFound();
    } else if (page && (pageNum > pages || pageNum < 1)) {
        debugLog(`Not a valid page.`);
        notFound();
    }

    return (
        <main id="pokedex-page">
            <h1 className="pokedex-page__title">{`Pokédex`}</h1>
            <FilterGeneration generations={pokemonGenerations.results} />
            <ListGlowItemBorders
                list={pokemonList}
                cardComponent={PokemonCard}
                itemStyles={itemStyles}
                className="pokemon-list"
            />
            {pages > 1 && <Pagination pages={pages} currentPage={currentPage} />}
        </main>
    );
}

const itemStyles = {
    itemStyle: {
        borderWidth: "1px",
        // borderRadius: "8px",
        borderColor: "rgba(187, 187, 187, 0.25)",
        // blur: "1px",
        // backgroundColor: "rgb(141, 0, 0)",
    },
    radialBackdrop: {
        size: "600px",
        // color: "rgba(241, 23, 34, 0.04)",
        color: "hsl(from var(--border-glow) h s l / 0.04)",
        falloff: "50%",
        // opacity: "1",
    },
    borderGlow: {
        size: "400px",
        color: "var(--border-glow)",
        falloff: "40%",
        // opacity: "1",
    },
};
