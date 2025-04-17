"use client";

import { NamedAPIResourceList } from "pokenode-ts";

import GuessForm from "./GuessForm";
import GameSettings from "./GameSettings";
import GameDisplay from "./GameDisplay";
import ScoreProgress from "./ScoreProgress";
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
        generationNum,
        generation,
        // Loading state
        isGenLoading,
        isPokemonLoading,
        // Handlers
        handleSelectGeneration,
        handleSetIsGameActive,
        handleRetry,
        handleNext,
        handleGuess,
    } = useGuessGameContext();

    return (
        <div className="guess-game-wrapper">
            <GameDisplay
                pokemon={pokemon}
                pokemonId={pokemonId}
                randomNum={randomNum}
                isRevealed={isRevealed}
                isGameOver={isGameOver}
                isPokemonLoading={isPokemonLoading}
            />

            <GameSettings
                generations={generations}
                isGameActive={isGameActive}
                handleSelectGeneration={handleSelectGeneration}
                handleSetIsGameActive={handleSetIsGameActive}
                generationNum={generationNum}
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
