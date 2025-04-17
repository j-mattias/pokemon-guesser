"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { Generation, MainClient, Pokemon } from "pokenode-ts";

import { extractPokemonId, padStartId, randomizeNumber } from "@/utils/helpers";

interface IGuessGameProvider {
    children: ReactNode;
}

interface IGenRange {
    start: number;
    end: number;
}

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

    // Handlers
    handleSelectGeneration: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSetIsGameActive: (bool: boolean) => void;
    handleRetry: () => void;
    handleNext: () => void;
    handleGuess: (guess: string) => void;
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

    const pokeApi = new MainClient({ logs: true });

    // Check if game is won
    const isGameWon = score === genTotal;

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

    const handleSelectGeneration = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGenerationNum(+e.target.value);
        handleRetry();
    };

    const handleSetIsGameActive = (bool: boolean) => {
        setIsGameActive(bool);
        setGenerationName(generation?.name || "N/A");
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
        setIsGenLoading(true);

        const fetchGeneration = async (gen: number) => {
            try {
                const genPokemon = await pokeApi.game.getGenerationById(gen);
                console.log("Generation, ", genPokemon);

                setGeneration(genPokemon);
                setIsGenLoading(false);
            } catch (error) {
                console.error(error);
                setIsGenLoading(false);
            }
        };
        fetchGeneration(generationNum);
    }, [generationNum]);
    
    // Update generation range
    useEffect(() => {
        // Get the start and end of the generation
        // The first pokemon in the list is the first id in the generation
        // But the last pokemon has to be calculated based on the total as it's not sorted
        const start = generation
        ? extractPokemonId(generation.pokemon_species[0].url)
        : DEFAULT_GEN_NUM;
        const genTotalNum = generation?.pokemon_species.length || GEN_ONE_TOTAL;
        setGenTotal(genTotalNum);
        const end = genTotalNum - 1 + start;
        
        console.log("Gen range: ", start, end);
        setGenerationRange((prevRange) => ({ ...prevRange, start, end }));
    }, [generation]);

    // Randomize a number within the generation range. Used to fetch a pokemon in GameDisplay
    useEffect(() => {
        console.log("Ranges: ", generationRange);
        // Get a unique random number
        const randomNum = preventRepeat(generationRange.start, generationRange.end);
        console.log("Previous ids: ", prevPokemonId);
        setRandomNum(randomNum);
    }, [next, generationRange]);

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

                setIsPokemonLoading(false);
            } catch (error) {
                console.error(error);
                setIsPokemonLoading(false);
            }
        };
        fetchPokemon(randomNum);
    }, [randomNum]);

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
                handleSelectGeneration,
                handleSetIsGameActive,
                handleRetry,
                handleNext,
                handleGuess,
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
