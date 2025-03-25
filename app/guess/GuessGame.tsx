"use client";

import { MainClient, NamedAPIResourceList, Generation } from "pokenode-ts";

import { useEffect, useState } from "react";

import { randomizeNumber } from "@/utils/helpers";

import GuessForm from "./GuessForm";
import GameSettings from "./GameSettings";
import GameDisplay from "./GameDisplay";

import "./GuessGame.css";

interface IGuessGame {
    generations: NamedAPIResourceList;
}

export default function GuessGame({ generations }: IGuessGame) {
    // Pokemon state
    const [pokemon, setPokemon] = useState<string>("");
    const [pokemonId, setPokemonId] = useState<string>("");
    const [prevPokemonId, setPrevPokemonId] = useState<Set<number>>(new Set());
    const [isPokemonLoading, setIsPokemonLoading] = useState<boolean>(true);
    // Game state
    const [score, setScore] = useState<number>(0);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [isRevealed, setIsRevealed] = useState<boolean>(false);
    const [isGameActive, setIsGameActive] = useState<boolean>(false);
    // Game settings
    const [next, setNext] = useState<boolean>(false);
    const [generationNum, setGenerationNum] = useState<number>(1);
    const [generation, setGeneration] = useState<Generation | undefined>(undefined);

    const pokeApi = new MainClient({ logs: true });

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

    // Reset the game
    const handleRetry = () => {
        setIsRevealed(false);
        setIsGameOver(false);
        setScore(0);
        setPrevPokemonId(new Set());
        // setNext(!next);
        setIsGameActive(false);
    };

    const handleSelectGeneration = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGenerationNum(+e.target.value);
        handleRetry();
    };

    const handleSetIsGameActive = (bool: boolean) => {
        setIsGameActive(bool);
    };

    // Prevents the same pokemon from being displayed twice during a game
    const preventRepeat = (start: number, end: number): number => {
        let randomNum: number;

        // If an id has already been used, keep randomizing until a unique one is found
        do {
            randomNum = randomizeNumber(start, end);
        } while (prevPokemonId.has(randomNum));

        // Update the set with previous ids
        setPrevPokemonId((prevSet) => {
            const newSet = new Set(prevSet);
            newSet.add(randomNum);
            return newSet;
        });
        return randomNum;
    };

    // Fetch the list of pokemon for the given generation
    useEffect(() => {
        const fetchGeneration = async (gen: number) => {
            try {
                const genPokemon = await pokeApi.game.getGenerationById(gen);
                console.log("Generation, ", genPokemon);

                setGeneration(genPokemon);
            } catch (error) {
                console.error(error);
            }
        };
        fetchGeneration(generationNum);
        // setPrevPokemonId(new Set());
    }, [generationNum]);

    // Fetch a random pokemon on first render and when the next button is clicked
    useEffect(() => {
        // Get the start and end of the generation
        // The first pokemon in the list is the first id in the generation
        // But the last pokemon has to be calculated based on the total as it's not sorted
        const idRegex = /(\d+)\/$/;
        const start = Number(generation?.pokemon_species[0].url.match(idRegex)?.[1]) || 1;
        const genTotal = generation?.pokemon_species.length || 151;
        const end = genTotal - 1 + start;
        console.log("Gen range: ", start, end);

        // Get a unique random number
        const randomNum = preventRepeat(start, end);
        console.log("Previous ids: ", prevPokemonId);

        setIsPokemonLoading(true);

        // Fetch a random pokemon by id
        const fetchPokemon = async (id: number) => {
            try {
                const pokemon = await pokeApi.pokemon.getPokemonById(id);
                setPokemon(pokemon.name);
                console.log("fetched pokemon: ", pokemon.name);

                // Convert the pokemon id to a 3 digit string, compatible with the image url
                const pokemonId = id.toString().padStart(3, "0");
                setPokemonId(pokemonId);

                setIsPokemonLoading(false);
            } catch (error) {
                console.error(error);
                setIsPokemonLoading(false);
            }
        };
        fetchPokemon(randomNum);
    }, [next, generation]);

    return (
        <div className="guess-game-wrapper">
            {generation && <h2 className="generation-title">{generation.name}</h2>}

            <GameDisplay
                pokemonId={pokemonId}
                pokemon={pokemon}
                isPokemonLoading={isPokemonLoading}
                isRevealed={isRevealed}
            />

            <GameSettings
                generations={generations}
                isGameActive={isGameActive}
                handleSelectGeneration={handleSelectGeneration}
                handleSetIsGameActive={handleSetIsGameActive}
                generationNum={generationNum}
            />

            {isGameActive && (
                <div className={`game-controls`}>
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
                                <GuessForm handleGuess={handleGuess} generation={generation} />
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
