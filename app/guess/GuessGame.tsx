"use client";

import Image from "next/image";

import { PokemonClient } from "pokenode-ts";
import { randomizeNumber } from "@/utils/helpers";

import GuessForm from "./GuessForm";
import { useEffect, useState } from "react";

import "./GuessGame.css";

export default function GuessGame() {
    const [pokemon, setPokemon] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [isRevealed, setIsRevealed] = useState<boolean>(false);
    const [pokemonId, setPokemonId] = useState<string>("");
    const [prevPokemonId, setPrevPokemonId] = useState<Set<number>>(new Set());
    const [next, setNext] = useState<boolean>(false);

    const pokeApi = new PokemonClient();

    // Handle the guess
    const handleGuess = (guess: string) => {
        if (guess.trim() === "") return;

        if (guess.toLowerCase().trim() === pokemon.toLowerCase()) {
            setScore((prevScore) => prevScore + 1);
        } else {
            setIsGameOver(true);
        }
        setIsRevealed(true);
    };

    const handleNext = () => {
        setIsRevealed(false);
        setNext(!next);
    };

    const handleRetry = () => {
        setIsRevealed(false);
        setIsGameOver(false);
        setScore(0);
    };

    // Prevents the same pokemon from being displayed twice during a game
    const preventRepeat = (): number => {
        let randomNum: number;

        // If an id has already been used, keep randomizing until a unique one is found
        do {
            randomNum = randomizeNumber(1, 151);
        } while (prevPokemonId.has(randomNum));

        // Update the set with previous ids
        setPrevPokemonId((prevSet) => {
            const newSet = new Set(prevSet);
            newSet.add(randomNum);
            return newSet;
        });
        return randomNum;
    };

    useEffect(() => {
        // Get a unique random number
        const randomNum = preventRepeat();
        console.log("Previous ids: ", prevPokemonId);

        // Convert the pokemon id to a 3 digit string, compatible with the image url
        const pokemonId = randomNum.toString().padStart(3, "0");
        setPokemonId(pokemonId);

        // Fetch a random pokemon by id
        const fetchPokemon = async (id: number) => {
            try {
                const pokemon = await pokeApi.getPokemonById(id);
                setPokemon(pokemon.name);
                console.log("fetched pokemon: ", pokemon.name);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPokemon(randomNum);
    }, [next]);

    return (
        <div className="guess-game-wrapper">
            <figure className="guess-game">
                <Image
                    className={`guess-game__pokemon-image ${isRevealed ? "revealed" : ""}`}
                    src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemonId}.png`}
                    alt={"Image of a pokemon to guess"}
                    width={500}
                    height={500}
                />
                <figcaption className={`guess-game__answer`}>{isRevealed ? pokemon.toUpperCase() : "?"}</figcaption>
            </figure>
            {isGameOver ? (
                <>
                    <h2>Game Over</h2>
                    <h3>Score: {score}</h3>
                    <button onClick={handleRetry}>Try again?</button>
                </>
            ) : (
                <>
                    {score > 0 && <h3>Score: {score}</h3>}
                    {isRevealed ? (
                        <button onClick={handleNext}>Next</button>
                    ) : (
                        <GuessForm handleGuess={handleGuess} />
                    )}
                </>
            )}
        </div>
    );
}
