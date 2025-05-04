"use client";

import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react";

import { Generation, MainClient, Pokemon } from "pokenode-ts";

import { extractPokemonId, padStartId, randomizeNumber } from "@/utils/helpers";
import { TSingleValue } from "@/utils/types";

interface IGuessGameProvider {
    children: ReactNode;
}

export type TErrorState = string | null;

interface IGuessGameContext {
    // Pokemon state
    pokemon: Pokemon | undefined;
    pokemonId: string;

    // Game state
    score: number;
    isGameOver: boolean;
    isRevealed: boolean;
    isGameActive: boolean;
    isGameWon: boolean;
    genTotal: number;
    generationName: string;

    // Game settings
    generationNum: number;
    generation: Generation | undefined;

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
}

type TAction =
    | { type: "randomize"; reset?: boolean }
    | { type: "pokemonIds"; remainingIds: number[] };

const GEN_ONE_TOTAL = 151;
const DEFAULT_GEN_NUM = 1;
const DEFAULT_POKEMON_ID = 1;

const initialState = {
    randomId: DEFAULT_POKEMON_ID,
    remainingIds: [],
    staticIds: [],
};

// Reducer function for randomizing pokemonId based on generation range
const pokemonIdReducer = (state: IState, action: TAction): IState => {
    // Destructure state variables
    const { remainingIds, staticIds } = state;

    // Randomize a new pokemonId
    if (action.type === "randomize") {
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

        console.log("Remaining ids: ", newIds);
        return { ...state, randomId: id, remainingIds: newIds };
    } else if (action.type === "pokemonIds") {
        // Update the pokemon id arrays
        const newState = {
            ...state,
            remainingIds: action.remainingIds,
            staticIds: action.remainingIds,
        };

        // Randomize an id from the new array
        return pokemonIdReducer(newState, { type: "randomize", reset: true });
    } else {
        throw new Error("Unknown action in pokemonIdReducer.");
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
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [isRevealed, setIsRevealed] = useState<boolean>(false);
    const [isGameActive, setIsGameActive] = useState<boolean>(false);
    const [genTotal, setGenTotal] = useState<number>(GEN_ONE_TOTAL);
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
            setScore((prevScore) => prevScore + 1);
        } else {
            setIsGameOver(true);
        }
        setIsRevealed(true);
    };

    const handleNext = () => {
        setIsRevealed(false);
        dispatch({ type: "randomize" });
    };

    // Reset the game
    const handleRetry = () => {
        setIsRevealed(false);
        setIsGameOver(false);
        setScore(0);
        dispatch({ type: "randomize", reset: true });
        setIsGameActive(false);
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
                console.log("Generation, ", genPokemon);

                setGeneration(genPokemon);
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
                setPokemon(pokemon);
                console.log("fetched pokemon: ", pokemon.name);

                // Convert the pokemon id to a 3 digit string, compatible with the image url
                const pokemonId = padStartId(id);
                setPokemonId(pokemonId);

                // Set the pokemon name, for checking correct guess
                setPokemonName(pokemon.name);

                setPokemonFetchError(null);
                setIsPokemonLoading(false);
            } catch (error) {
                console.error(error);
                setPokemonFetchError(`Failed to fetch pokemon with id: ${id}.`);
                setIsPokemonLoading(false);
            }
        };
        fetchPokemon(state.randomId);
        console.log("randomId: ", state.randomId);
        // The pokemonRefetch dependency allows the user to attempt to fetch the pokemon
        // again if there was an error during the game
    }, [state.randomId, pokemonRefetch]);

    return (
        <GuessGameContext
            value={{
                pokemon,
                pokemonId,
                score,
                genTotal,
                isGameOver,
                isGameActive,
                isRevealed,
                isGameWon,
                generation,
                generationName,
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
