"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

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
    prevPokemonId: Set<number>;
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

const GEN_ONE_TOTAL = 151;
const DEFAULT_GEN_NUM = 1;

const GuessGameContext = createContext<IGuessGameContext | null>(null);

export function GuessGameContextProvider({ children }: IGuessGameProvider) {
    // Pokemon state
    const [pokemon, setPokemon] = useState<Pokemon | undefined>(undefined);
    const [pokemonId, setPokemonId] = useState<string>("");
    const [pokemonName, setPokemonName] = useState<string>("");
    const [prevPokemonId, setPrevPokemonId] = useState<Set<number>>(new Set());
    const [randomNum, setRandomNum] = useState<number>(1);
    // Game state
    const [score, setScore] = useState<number>(0);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [isRevealed, setIsRevealed] = useState<boolean>(false);
    const [isGameActive, setIsGameActive] = useState<boolean>(false);
    const [genTotal, setGenTotal] = useState<number>(GEN_ONE_TOTAL);
    // Game settings
    const [next, setNext] = useState<boolean>(false);
    const [generationNum, setGenerationNum] = useState<number>(DEFAULT_GEN_NUM);
    const [generationName, setGenerationName] = useState<string>("generation-i");
    const [generation, setGeneration] = useState<Generation | undefined>(undefined);
    const [generationRange, setGenerationRange] = useState<IGenRange>({
        start: DEFAULT_GEN_NUM,
        end: GEN_ONE_TOTAL,
    });
    // Loading state
    const [isPokemonLoading, setIsPokemonLoading] = useState<boolean>(true);
    const [isGenLoading, setIsGenLoading] = useState<boolean>(true);
    // Error state
    const [pokemonFetchError, setPokemonFetchError] = useState<TErrorState>(null);
    const [pokemonRefetch, setPokemonRefetch] = useState<boolean>(false);
    const [generationFetchError, setGenerationFetchError] = useState<TErrorState>(null);

    const pokeApi = useMemo(() => new MainClient({ logs: true }), []);

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
        setNext(!next);
    };

    // Reset the game
    const handleRetry = () => {
        setIsRevealed(false);
        setIsGameOver(false);
        setScore(0);
        setPrevPokemonId(new Set());
        setNext(!next);
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

    // Prevents the same pokemon from being displayed twice during a game
    const preventRepeat = useCallback((start: number, end: number): number => {
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
    }, [prevPokemonId]);

    // Fetch the list of pokemon for the given generation
    useEffect(() => {
        setIsGenLoading(true);

        const fetchGeneration = async (gen: number) => {
            try {
                const genPokemon = await pokeApi.game.getGenerationById(gen);
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

        // Set genTotal, generationRange and clear prevPokemonId
        setGenTotal(genTotalNum);
        setGenerationRange({ start, end });
        setPrevPokemonId(new Set());
        console.log("Gen range: ", start, end);

        // Randomize a number in the given range
        // Triggers a pokemon fetch
        const randomNum = preventRepeat(start, end);
        setRandomNum(randomNum);
    }, [generation]);

    // Randomize a number within the generation range when next is updated. 
    // Triggers a pokemon fetch
    useEffect(() => {
        // Get a unique random number
        const randomNum = preventRepeat(generationRange.start, generationRange.end);
        setRandomNum(randomNum);
    }, [next]);

    // Fetch pokemon based on random number
    useEffect(() => {
        setIsPokemonLoading(true);

        // Fetch a random pokemon by id
        const fetchPokemon = async (id: number) => {
            try {
                const pokemon = await pokeApi.pokemon.getPokemonById(id);
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
        fetchPokemon(randomNum);
        console.log("randomNum: ", randomNum);
        console.log("Previous ids: ", prevPokemonId);
        // The pokemonRefetch dependency allows the user to attempt to fetch the pokemon
        // again if there was an error during the game
    }, [randomNum, pokemonRefetch]);

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
                randomNum,
                prevPokemonId,
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
