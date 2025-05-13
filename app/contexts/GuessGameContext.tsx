"use client";

import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react";

import { Generation, MainClient, Pokemon } from "pokenode-ts";

import {
    debugLog,
    extractPokemonId,
    padStartId,
    randomizeNumber,
    replaceCharWithSpace,
} from "@/utils/helpers";

import { TSingleValue } from "@/utils/types";

interface IGuessGameProvider {
    children: ReactNode;
}

interface ICorrectPokemon {
    pokemonId: string;
    name: string;
}

export type TErrorState = string | null;

interface IGuessGameContext {
    // Pokemon state
    pokemon: Pokemon | undefined;
    pokemonId: string;

    // Game state
    score: number;
    lives: number;
    guess: string;
    isGameOver: boolean;
    isRevealed: boolean;
    isWrongGuess: boolean;
    isGameActive: boolean;
    isGameWon: boolean;
    genTotal: number;
    generationName: string;
    correctPokemonIds: ICorrectPokemon[];

    // Game settings
    generationNum: number;
    generation: Generation | undefined;
    maxLives: number;

    // Loading state
    isGenLoading: boolean;
    isPokemonLoading: boolean;

    // Error state
    pokemonFetchError: TErrorState;
    generationFetchError: TErrorState;

    // Handlers
    handleSelectGeneration: (option: TSingleValue) => void;
    handleSetIsGameActive: (bool: boolean) => void;
    handleRetry: () => void;
    handleNext: () => void;
    handleGuess: (guess: string) => void;
    handleRefetchPokemon: () => void;
}

interface IState {
    randomId: number;
    remainingIds: number[];
    staticIds: number[];
    prevId: number;
}

type TAction =
    | { type: "randomize"; reset?: boolean }
    | { type: "pokemonIds"; remainingIds: number[] }
    | { type: "restoreId" };

const GEN_ONE_TOTAL = 151;
const DEFAULT_GEN_NUM = 1;
const DEFAULT_POKEMON_ID = 1;
const MAX_LIVES = 3;

const initialState = {
    randomId: DEFAULT_POKEMON_ID,
    remainingIds: [],
    staticIds: [],
    prevId: 0,
};

// Reducer function for randomizing pokemonId based on generation range
const pokemonIdReducer = (state: IState, action: TAction): IState => {
    // Destructure state variables
    const { remainingIds, staticIds, prevId } = state;

    switch (action.type) {
        case "randomize": {
            // If reseting, use list of static ids, otherwise use remaining
            let newIds: number[];
            if (action.reset) {
                newIds = [...staticIds];
            } else {
                newIds = [...remainingIds];
            }

            // Randomize an index based on the length of the remainingIds.
            // Remove and extract id from the remaining ids
            const randomNum = randomizeNumber(0, newIds.length - 1);
            const randomId = newIds.splice(randomNum, 1);
            const id = randomId[0];

            debugLog(`Remaining ids: `, newIds);
            return { ...state, randomId: id, remainingIds: newIds, prevId: id };
        }
        case "pokemonIds": {
            // Update the pokemon id arrays
            const newState = {
                ...state,
                remainingIds: action.remainingIds,
                staticIds: action.remainingIds,
            };

            // Randomize an id from the new array
            return pokemonIdReducer(newState, { type: "randomize", reset: true });
        }
        case "restoreId": {
            // Add the id back into remainingIds if guess was incorrect
            return {
                ...state,
                remainingIds: [...remainingIds, prevId],
            };
        }
        default: {
            throw new Error(`Unknown action in pokemonIdReducer.`);
        }
    }
};

// Initialize main pokemon client
const POKE_API = new MainClient({ logs: true });

const GuessGameContext = createContext<IGuessGameContext | null>(null);

export function GuessGameContextProvider({ children }: IGuessGameProvider) {
    // Pokemon state
    const [pokemon, setPokemon] = useState<Pokemon | undefined>(undefined);
    const [pokemonId, setPokemonId] = useState<string>("");
    const [pokemonName, setPokemonName] = useState<string>("");
    // Game state
    const [score, setScore] = useState<number>(0);
    const [lives, setLives] = useState<number>(MAX_LIVES);
    const [isWrongGuess, setIsWrongGuess] = useState<boolean>(false);
    const [guess, setGuess] = useState<string>("");
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [isRevealed, setIsRevealed] = useState<boolean>(false);
    const [isGameActive, setIsGameActive] = useState<boolean>(false);
    const [genTotal, setGenTotal] = useState<number>(GEN_ONE_TOTAL);
    const [correctPokemonIds, setCorrectPokemonIds] = useState<ICorrectPokemon[]>([]);
    // Game settings
    const [generationNum, setGenerationNum] = useState<number>(DEFAULT_GEN_NUM);
    const [generationName, setGenerationName] = useState<string>("generation-i");
    const [generation, setGeneration] = useState<Generation | undefined>(undefined);
    // Loading state
    const [isPokemonLoading, setIsPokemonLoading] = useState<boolean>(true);
    const [isGenLoading, setIsGenLoading] = useState<boolean>(true);
    // Error state
    const [pokemonFetchError, setPokemonFetchError] = useState<TErrorState>(null);
    const [pokemonRefetch, setPokemonRefetch] = useState<boolean>(false);
    const [generationFetchError, setGenerationFetchError] = useState<TErrorState>(null);
    // Reducer for randomizing pokemonId based on generation range
    const [state, dispatch] = useReducer(pokemonIdReducer, initialState);

    // Check if game is won
    const isGameWon = score === genTotal;

    // Attempt to fetch pokemon again
    const handleRefetchPokemon = () => {
        setPokemonRefetch((prevPR) => !prevPR);
    };

    // Handle the guess
    const handleGuess = (guess: string) => {
        if (guess.trim() === "") return;

        if (guess.toLowerCase().trim() === pokemonName.toLowerCase()) {
            // If guess is correct, update score, reveal pokemon
            setScore((prevScore) => prevScore + 1);
            setIsRevealed(true);
            setIsWrongGuess(false);
        } else if (lives > 1) {
            // If the guess is wrong, remove one life, add the id back into the guess pool and
            // set the guess to display it as incorrect
            setLives((prevLives) => prevLives - 1);
            dispatch({ type: "restoreId" });
            setGuess(guess);
            setIsWrongGuess(true);
        } else {
            // If lives run out set game over
            setLives((prevLives) => prevLives - 1);
            setIsGameOver(true);
        }
    };

    const handleNext = () => {
        // Only add pokemonId if the guess was correct
        if (isRevealed) {
            setCorrectPokemonIds((prevIds) => [...prevIds, { pokemonId, name: pokemonName }]);
        }
        // Reset states and randomize new pokemon
        setIsRevealed(false);
        setIsWrongGuess(false);
        setGuess("");
        dispatch({ type: "randomize" });
    };

    // Reset the game
    const handleRetry = () => {
        setIsRevealed(false);
        setIsGameOver(false);
        setScore(0);
        setCorrectPokemonIds([]);
        dispatch({ type: "randomize", reset: true });
        setIsGameActive(false);
        setLives(MAX_LIVES);
    };

    // Set the generation
    const handleSelectGeneration = (option: TSingleValue) => {
        if (option) {
            setGenerationNum(option.value);
        }
    };

    const handleSetIsGameActive = (bool: boolean) => {
        setIsGameActive(bool);
        setGenerationName(generation?.name || "N/A");
    };

    // Fetch the list of pokemon for the given generation
    useEffect(() => {
        setIsGenLoading(true);

        const fetchGeneration = async (gen: number) => {
            try {
                const genPokemon = await POKE_API.game.getGenerationById(gen);
                // Edit the pokemon names to remove dashes
                const updatedPokemonSpecies = genPokemon.pokemon_species.map((pokemon) => {
                    return { ...pokemon, name: replaceCharWithSpace(pokemon.name, "-") };
                });
                const updatedGenPokemon = { ...genPokemon, pokemon_species: updatedPokemonSpecies };
                debugLog(`Generation: `, updatedGenPokemon);

                setGeneration(updatedGenPokemon);
                setIsGenLoading(false);
            } catch (error) {
                console.error(error);
                setGenerationFetchError(
                    `Failed to load game data. Try refreshing or come back later.`
                );
                setIsGenLoading(false);
            }
        };
        fetchGeneration(generationNum);
    }, [generationNum]);

    // Update generation range
    useEffect(() => {
        if (!generation) return;

        // Extract ids into an array to check what the smallest id is
        const extractedIds = generation.pokemon_species
            .map((pokemon) => extractPokemonId(pokemon.url))
            .sort((a, b) => a - b);

        // Update genTotal
        const genTotalNum = generation.pokemon_species.length;
        setGenTotal(genTotalNum);

        dispatch({ type: "pokemonIds", remainingIds: extractedIds });
    }, [generation]);

    // Fetch pokemon based on random number
    useEffect(() => {
        setIsPokemonLoading(true);

        // Fetch a random pokemon by id
        const fetchPokemon = async (id: number) => {
            try {
                const pokemon = await POKE_API.pokemon.getPokemonById(id);
                // Edit pokemon name to remove dash
                const updatedPokemon = {
                    ...pokemon,
                    name: replaceCharWithSpace(pokemon.name, "-"),
                };
                setPokemon(updatedPokemon);
                debugLog(`Fetched pokemon: `, updatedPokemon.name);

                // Convert the pokemon id to a 3 digit string, compatible with the image url
                const pokemonId = padStartId(id);
                setPokemonId(pokemonId);

                // Set the pokemon name, for checking correct guess
                setPokemonName(updatedPokemon.name);

                setPokemonFetchError(null);
                setIsPokemonLoading(false);
            } catch (error) {
                console.error(error);
                setPokemonFetchError(`Failed to fetch pokemon with id: ${id}.`);
                setIsPokemonLoading(false);
            }
        };
        fetchPokemon(state.randomId);
        debugLog(`randomId: `, state.randomId);

        // The pokemonRefetch dependency allows the user to attempt to fetch the pokemon
        // again if there was an error during the game
    }, [state.randomId, pokemonRefetch]);

    return (
        <GuessGameContext
            value={{
                pokemon,
                pokemonId,
                score,
                lives,
                guess,
                genTotal,
                isGameOver,
                isGameActive,
                isRevealed,
                isWrongGuess,
                isGameWon,
                generation,
                maxLives: MAX_LIVES,
                generationName,
                correctPokemonIds,
                generationNum,
                isGenLoading,
                isPokemonLoading,
                pokemonFetchError,
                generationFetchError,
                handleSelectGeneration,
                handleSetIsGameActive,
                handleRetry,
                handleNext,
                handleGuess,
                handleRefetchPokemon,
            }}
        >
            {children}
        </GuessGameContext>
    );
}

export function useGuessGameContext() {
    const context = useContext(GuessGameContext);

    if (!context) {
        throw new Error("useGuessGameContext must be used within a GuessGameContextProvider.");
    }

    return context;
}
