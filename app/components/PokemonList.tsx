"use client";

import { useEffect, useRef, useState } from "react";

import { NamedAPIResource } from "pokenode-ts";

import { extractPokemonId, padStartId } from "@/utils/helpers";

import PokemonCard from "./PokemonCard";

export interface IMousePos {
    x: number;
    y: number;
}

export default function PokemonList({ pokemonList }: { pokemonList: NamedAPIResource[] }) {
    const [mousePos, setMousePos] = useState<IMousePos>({ x: 0, y: 0 });
    const [windowChange, setWindowChange] = useState<boolean>(false);

    const listRef = useRef<HTMLDivElement | null>(null);

    // Update the mousePos when moving the mouse inside the list container
    const handleMouseMove = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setMousePos((prevPos) => ({ ...prevPos, x: e.clientX, y: e.clientY }));
    };

    useEffect(() => {
        if (!listRef.current) return;

        // Add event listener, so that getBoundingClientRect gets updated when window changes
        const updateWindow = () => {
            // Toggle state so that dependency will cause an update
            setWindowChange((prev) => !prev);
        }
        window.addEventListener("resize", updateWindow);

        // Remove listener on unmount
        return () => {
            window.removeEventListener("resize", updateWindow)
        };
    }, []);

    return (
        <div className="pokemon-list" onMouseMove={handleMouseMove} ref={listRef}>
            {pokemonList.map((pokemon) => {
                const pokemonId = extractPokemonId(pokemon.url);
                const paddedId = padStartId(pokemonId);

                return (
                    <PokemonCard
                        name={pokemon.name}
                        paddedId={paddedId}
                        key={pokemonId}
                        mousePos={mousePos}
                        windowChange={windowChange}
                    />
                );
            })}
        </div>
    );
}
