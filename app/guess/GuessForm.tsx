"use client";

import { useState } from "react";
import "./GuessForm.css";

interface IGuessForm {
    handleGuess: (guess: string) => void;
}

export default function GuessForm({ handleGuess }: IGuessForm) {
    const [guess, setGuess] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Process the guess
        handleGuess(guess);

        setGuess("");
    };

    return (
        <form onSubmit={handleSubmit} className="guess-form">
            <div className="input-wrapper">
                <label htmlFor="guess-input">Who's that Pokemon?</label>
                <input
                    type="text"
                    id="guess-input"
                    name="guess-input"
                    onChange={(e) => setGuess(e.target.value)}
                    value={guess}
                />
            </div>
            <button className="submit-btn" type="submit">
                Guess
            </button>
        </form>
    );
}
