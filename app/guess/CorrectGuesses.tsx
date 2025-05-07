"use client";

import Image from "next/image";

import { useGuessGameContext } from "../contexts/GuessGameContext";
import Divider from "../components/Divider";

import "./CorrectGuesses.css";

export default function CorrectGuesses() {
    const { correctPokemonIds } = useGuessGameContext();

    if (correctPokemonIds.length === 0) return null;

    return (
        <div className="correct-guesses-wrapper">
            <Divider text="Previous" />
            <figure className="correct-guesses">
                {correctPokemonIds.map((correct) => (
                    <div
                        className="tooltip-wrapper"
                        data-name={correct.name}
                        key={correct.pokemonId}
                    >
                        <Image
                            src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${correct.pokemonId}.png`}
                            alt={`Image of ${correct.name}`}
                            width={100}
                            height={100}
                        />
                    </div>
                ))}
            </figure>
        </div>
    );
}
