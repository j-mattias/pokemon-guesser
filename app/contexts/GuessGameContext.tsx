"use client";

import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react";

import { Generation, MainClient, Pokemon } from "pokenode-ts";

import { extractPokemonId, padStartId, randomizeNumber } from "@/utils/helpers";
import { TSingleValue } from "@/utils/types";

interface IGuessGameProvider {
    children: ReactNode;
}

interface IGenRange {
    start: number;
    end: number;
}

export type TErrorState = string | null;

interface IGuessGameContext {
    // Pokemon state
    pokemon: Pokemon | undefined;
    pokemonId: string;
    randomNum: number;

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
    genRange: IGenRange;
    randomNum: number;
    prevPokemonIds: Set<number>;
}

type TAction = { type: "randomize"; clear: boolean } | { type: "genRange"; genRange: IGenRange };

const GEN_ONE_TOTAL = 151;
const DEFAULT_GEN_NUM = 1;
const DEFAULT_POKEMON_ID = 1;

const initialState = {
    genRange: { start: DEFAULT_GEN_NUM, end: GEN_ONE_TOTAL },
    randomNum: DEFAULT_POKEMON_ID,
    prevPokemonIds: new Set<number>(),
};

// Reducer function for randomizing pokemonId based on generation range
const pokemonIdReducer = (state: IState, action: TAction): IState => {
    // Destructure state variables
    const {
        genRange: { start, end },
        prevPokemonIds,
    } = state;
    
    // Randomize a new pokemonId
    if (action.type === "randomize") {
        // Create a new set based on previous set to modify
        const newSet = new Set(prevPokemonIds);
        
        if (action.clear) {
            newSet.clear();
        }
        
        // Randomize a number that's not in the set yet
        let num: number;
        do {
            num = randomizeNumber(start, end);
        } while (newSet.has(num));
        newSet.add(num);
        
        console.log("prevPokemonIds: ", newSet)
        return { ...state, randomNum: num, prevPokemonIds: newSet };
    } else if (action.type === "genRange") {
        // Update the generation range and randomize a new number based on new range
        const newState = { ...state, genRange: action.genRange };

        return pokemonIdReducer(newState, { type: "randomize", clear: true });
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
        dispatch({ type: "randomize", clear: false });
    };

    // Reset the game
    const handleRetry = () => {
        setIsRevealed(false);
        setIsGameOver(false);
        setScore(0);
        dispatch({ type: "randomize", clear: true });
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
        // Extract ids into an array to check what the smallest id is
        const extractedIds = generation?.pokemon_species.map((pokemon) =>
            extractPokemonId(pokemon.url)
        );
        // Find the smallest id in the array
        const firstId = extractedIds?.reduce(
            (min, current) => (min < current ? min : current),
            Infinity
        );
        console.log("smallest id: ", firstId);

        // Get the start and end of the generation
        const start = firstId ? firstId : DEFAULT_GEN_NUM;
        const genTotalNum = generation?.pokemon_species.length || GEN_ONE_TOTAL;
        const end = genTotalNum - 1 + start;

        // Update genTotal
        setGenTotal(genTotalNum);

        // Update genRange (also clears previousIds and randomizes a new number)
        console.log("Gen range: ", start, end);
        dispatch({ type: "genRange", genRange: { start, end } });
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
        fetchPokemon(state.randomNum);
        console.log("randomNum: ", state.randomNum);
        // The pokemonRefetch dependency allows the user to attempt to fetch the pokemon
        // again if there was an error during the game
    }, [state.randomNum, pokemonRefetch]);

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
                randomNum: state.randomNum,
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
