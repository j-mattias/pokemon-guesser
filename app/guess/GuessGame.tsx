"use client";

import Image from "next/image";

import { MainClient, NamedAPIResourceList, Generation } from "pokenode-ts";
import { randomizeNumber } from "@/utils/helpers";

import GuessForm from "./GuessForm";
import { useEffect, useState } from "react";

import "./GuessGame.css";

interface IGuessGame {
    generations: NamedAPIResourceList;
}

export default function GuessGame({ generations }: IGuessGame) {
    const [pokemon, setPokemon] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [isRevealed, setIsRevealed] = useState<boolean>(false);
    const [pokemonId, setPokemonId] = useState<string>("");
    const [prevPokemonId, setPrevPokemonId] = useState<Set<number>>(new Set());
    const [next, setNext] = useState<boolean>(false);
    const [generationNum, setGenerationNum] = useState<number>(1);
    const [generation, setGeneration] = useState<Generation | undefined>(undefined);
    const [isGameActive, setIsGameActive] = useState<boolean>(false);

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

        // Fetch a random pokemon by id
        const fetchPokemon = async (id: number) => {
            try {
                const pokemon = await pokeApi.pokemon.getPokemonById(id);
                setPokemon(pokemon.name);
                console.log("fetched pokemon: ", pokemon.name);

                // Convert the pokemon id to a 3 digit string, compatible with the image url
                const pokemonId = id.toString().padStart(3, "0");
                setPokemonId(pokemonId);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPokemon(randomNum);
    }, [next, generation]);

    return (
        <div className="guess-game-wrapper">
            {generation && <h2 className="generation-title">{generation.name}</h2>}
            <figure className="guess-game">
                {pokemonId ? (
                    <Image
                        className={`guess-game__pokemon-image ${isRevealed ? "revealed" : ""}`}
                        src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemonId}.png`}
                        alt={"Image of a pokemon to guess"}
                        width={500}
                        height={500}
                    />
                ) : (
                    "Loading..."
                )}
                <figcaption className={`guess-game__answer`}>
                    {isRevealed ? pokemon : "?"}
                </figcaption>
            </figure>

            {!isGameActive && (
                <div className="game-settings">
                    <label className="game-settings__label" htmlFor="generations">Pick a generation</label>
                    <select id="generations" onChange={handleSelectGeneration}>
                        {generations.results.map((gen, index) => (
                            <option key={gen.name} value={index + 1}>
                                {gen.name.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    <button className="start-game" onClick={() => setIsGameActive(true)}>
                        Start
                    </button>
                </div>
            )}

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
