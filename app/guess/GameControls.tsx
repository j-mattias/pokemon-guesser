"use client";

import { useGuessGameContext } from "../contexts/GuessGameContext";
import GuessForm from "./GuessForm";

import "./GameControls.css";

interface IGameControls {
    generationName: string;
    isGameOver: boolean;
    isRevealed: boolean;
}

export default function GameControls({ generationName, isGameOver, isRevealed }: IGameControls) {
    // Get state and handlers that arent shared in parent
    const { isGameWon, generation, handleGuess, handleNext, handleRetry } = useGuessGameContext();

    // Render UI based on the game state
    const renderGameState = () => {
        if (isGameWon) {
            return (
                <>
                    <h2>{`Well done! You cleared ${generationName.toUpperCase()}.`}</h2>
                    <button onClick={handleRetry} autoFocus={true}>Play again?</button>
                </>
            );
        } else if (isGameOver) {
            return (
                <>
                    <h2>Game Over</h2>
                    <button onClick={handleRetry} autoFocus={true}>
                        Try again?
                    </button>
                </>
            );
        } else {
            return isRevealed ? (
                <button onClick={handleNext} autoFocus={true}>
                    Next
                </button>
            ) : (
                <GuessForm handleGuess={handleGuess} generation={generation} />
            );
        }
    };

    return <div className={`game-controls`}>{renderGameState()}</div>;
}
