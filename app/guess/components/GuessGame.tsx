"use client";

import { NamedAPIResourceList } from "pokenode-ts";

import GameSettings from "./GameSettings";
import GameDisplay from "./GameDisplay";
import ScoreProgress from "./ScoreProgress";
import GameControls from "./GameControls";
import ErrorPage from "../../components/ErrorPage";
import CorrectGuesses from "./CorrectGuesses";
import { useGuessGameContext } from "../../contexts/GuessGameContext";

import "./GuessGame.css";

interface IGuessGame {
    generations: NamedAPIResourceList;
}

export default function GuessGame({ generations }: IGuessGame) {
    // Get game variables and functions
    const {
        // Pokemon state
        pokemon,
        pokemonId,
        // Game state
        score,
        isGameOver,
        isRevealed,
        isGameActive,
        genTotal,
        generationName,
        generationNum,
        // Loading state
        isGenLoading,
        isPokemonLoading,
        // Error state
        pokemonFetchError,
        generationFetchError,
        // Handlers
        handleSelectGeneration,
        handleSetIsGameActive,
        handleRefetchPokemon,
    } = useGuessGameContext();

    // If genertaion fetch fails, game data can't be loaded properly,
    // show an error component instead
    if (generationFetchError) {
        return <ErrorPage error={generationFetchError} />;
    }

    return (
        <div className="guess-game-wrapper">
            <GameDisplay
                pokemon={pokemon}
                pokemonId={pokemonId}
                isRevealed={isRevealed}
                isGameOver={isGameOver}
                isPokemonLoading={isPokemonLoading}
                pokemonFetchError={pokemonFetchError}
                handleRefetchPokemon={handleRefetchPokemon}
            />

            <GameSettings
                generations={generations.results}
                isGameActive={isGameActive}
                handleSelectGeneration={handleSelectGeneration}
                handleSetIsGameActive={handleSetIsGameActive}
                isGenLoading={isGenLoading}
                generationNum={generationNum}
            />

            {isGameActive && (
                <>
                    <ScoreProgress
                        score={score}
                        genTotal={genTotal}
                        generationName={generationName}
                    />

                    <GameControls
                        generationName={generationName}
                        isGameOver={isGameOver}
                        isRevealed={isRevealed}
                    />
                </>
            )}

            <CorrectGuesses />
        </div>
    );
}
