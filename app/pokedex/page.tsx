import React from "react";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import ListGlowItemBorders from "../components/ListGlowItemBorders";
import PokemonCard from "../components/PokemonCard";
import Pagination from "../components/Pagination";
import FilterGeneration from "../components/FilterGeneration";
import Search from "../components/Search";
import { debugLog, modifyPokemonList } from "@/utils/helpers";
import { IPokemonBasic } from "@/utils/interfaces";
import { POKEMON_MAX_COUNT } from "@/data/globalVariables";
import { fetchGenerationById, fetchGenerations, fetchPokemonList } from "@/utils/dataFetching";

import "./page.css";

export const metadata: Metadata = {
    title: "Pokedex",
    description: "Browse all Pokemon or by specific generation",
};

const LIMIT = 40;
const PATH = "/pokedex";

export default async function PokedexPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; gen?: string; query?: string }>;
}) {
    const { page, gen, query } = await searchParams;
    const pageNum = Number(page),
        genNum = Number(gen);

    // Fetch list of pokemon generations for filter component
    const pokemonGenerations = await fetchGenerations();

    // Fetch full list of pokemon and modify it
    const fullPokemonList = await fetchPokemonList(0, POKEMON_MAX_COUNT);
    const fullPokemonListModified = modifyPokemonList(fullPokemonList.results, PATH);
    debugLog("fullPokemonList: ", fullPokemonListModified);

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

        const modifiedPokemonList = modifyPokemonList(data.pokemon_species, PATH);

        // Sort the generation list by id (comes unsorted)
        const sortedList = modifiedPokemonList.sort((a, b) => a.id - b.id);

        // Set the results to show for a specified page
        pokemonList = sortedList.slice(offset, end);
        debugLog(`Gen list: `, pokemonList);

        // Calculate the amount of pages needed to display all pokemon in given generation
        pages = Math.ceil(sortedList.length / LIMIT);
    } else if (query) {
        // If there's a search query, filter results including that query
        const searchResults = fullPokemonListModified.filter(pokemon => {
            return pokemon.name.includes(query);
        });

        // Paginate the results
        pokemonList = searchResults.slice(offset, LIMIT + offset);
        pages = Math.ceil(searchResults.length / LIMIT);
    } else {
        // Slice the full pokemon list based on offset and LIMIT
        pokemonList = fullPokemonListModified.slice(offset, LIMIT + offset);
        debugLog("Sliced list: ", pokemonList);

        // Calculate the amount of pages needed to display all pokemon
        // (with available images) in the list
        pages = Math.ceil(fullPokemonListModified.length / LIMIT);
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
            <Search placeholder="Pokémon" query={query} />
            <FilterGeneration generations={pokemonGenerations.results} gen={gen} />
            <ListGlowItemBorders
                list={pokemonList}
                cardComponent={PokemonCard}
                itemStyles={itemStyles}
                className="pokemon-list"
            />
            {pokemonList.length === 0 && (
                <p style={{ textAlign: "center" }}>{`No results for "${query}".`}</p>
            )}
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
