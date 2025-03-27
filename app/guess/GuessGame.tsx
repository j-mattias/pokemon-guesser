"use client";

import { MainClient, NamedAPIResourceList, Generation } from "pokenode-ts";

import { useEffect, useState } from "react";

import { randomizeNumber } from "@/utils/helpers";

import GuessForm from "./GuessForm";
import GameSettings from "./GameSettings";
import GameDisplay from "./GameDisplay";
import ScoreProgress from "./ScoreProgress";

import "./GuessGame.css";

interface IGuessGame {
    generations: NamedAPIResourceList;
}

interface IGenRange {
    start: number;
    end: number;
}

const GEN_ONE_TOTAL = 151;
const DEFAULT_GEN_NUM = 1;

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
    const [genTotal, setGenTotal] = useState<number>(GEN_ONE_TOTAL);
    // Game settings
    const [next, setNext] = useState<boolean>(false);
    const [generationNum, setGenerationNum] = useState<number>(DEFAULT_GEN_NUM);
    const [generation, setGeneration] = useState<Generation | undefined>(undefined);
    const [generationRange, setGenerationRange] = useState<IGenRange>({
        start: DEFAULT_GEN_NUM,
        end: GEN_ONE_TOTAL,
    });

    const pokeApi = new MainClient({ logs: true });

    // Check if game is won
    const isGameWon = score === genTotal;

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

    // Update generation range
    useEffect(() => {
        // Get the start and end of the generation
        // The first pokemon in the list is the first id in the generation
        // But the last pokemon has to be calculated based on the total as it's not sorted
        const idRegex = /(\d+)\/$/;
        const start =
            Number(generation?.pokemon_species[0].url.match(idRegex)?.[1]) || DEFAULT_GEN_NUM;
        const genTotalNum = generation?.pokemon_species.length || GEN_ONE_TOTAL;
        setGenTotal(genTotalNum);
        const end = genTotalNum - 1 + start;

        console.log("Gen range: ", start, end);
        setGenerationRange((prevRange) => ({ ...prevRange, start, end }));
    }, [generation]);

    // Fetch a random pokemon on first render and when the next button is clicked
    useEffect(() => {
        console.log("Ranges: ", generationRange);
        // Get a unique random number
        const randomNum = preventRepeat(generationRange.start, generationRange.end);
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
    }, [next, generationRange]);

    return (
        <div className="guess-game-wrapper">
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
                <>
                    <ScoreProgress
                        score={score}
                        genTotal={genTotal}
                        generationName={generation?.name}
                    />
                    
                    <div className={`game-controls`}>
                        {isGameWon ? (
                            <>
                                <h2>{`Well done! You cleared ${generation?.name.toUpperCase()}.`}</h2>
                                <button onClick={handleRetry}>Play again?</button>
                            </>
                        ) : isGameOver ? (
                            <>
                                <h2>Game Over</h2>
                                <button onClick={handleRetry}>Try again?</button>
                            </>
                        ) : (
                            <>
                                {isRevealed ? (
                                    <button onClick={handleNext}>Next</button>
                                ) : (
                                    <GuessForm handleGuess={handleGuess} generation={generation} />
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
