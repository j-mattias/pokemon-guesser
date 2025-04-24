"use client";

import { NamedAPIResourceList } from "pokenode-ts";

import GuessForm from "./GuessForm";
import GameSettings from "./GameSettings";
import GameDisplay from "./GameDisplay";
import ScoreProgress from "./ScoreProgress";
import ErrorPage from "../components/ErrorPage";
import { useGuessGameContext } from "../contexts/GuessGameContext";

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
        randomNum,
        // Game state
        score,
        isGameOver,
        isRevealed,
        isGameActive,
        isGameWon,
        genTotal,
        generationName,
        // Game settings
        generation,
        // Loading state
        isGenLoading,
        isPokemonLoading,
        // Error state
        pokemonFetchError,
        generationFetchError,
        // Handlers
        handleSelectGeneration,
        handleSetIsGameActive,
        handleRetry,
        handleNext,
        handleGuess,
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
                randomNum={randomNum}
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
            />

            {isGameActive && (
                <>
                    <ScoreProgress
                        score={score}
                        genTotal={genTotal}
                        generationName={generationName}
                    />

                    <div className={`game-controls`}>
                        {isGameWon ? (
                            <>
                                <h2>{`Well done! You cleared ${generationName.toUpperCase()}.`}</h2>
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
