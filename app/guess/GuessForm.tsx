"use client";

import { useEffect, useState } from "react";
import { Generation } from "pokenode-ts";
import "./GuessForm.css";

interface IGuessForm {
    handleGuess: (guess: string) => void;
    generation: Generation | undefined;
}

export default function GuessForm({ handleGuess, generation }: IGuessForm) {
    const [guess, setGuess] = useState<string>("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Process the guess
        handleGuess(guess);
        setGuess("");
    };

    // Sets the filtered suggestion based on user input and the guess
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.toLowerCase();

        const filtered = suggestions
            .filter((suggestion) => suggestion.toLowerCase().includes(input))
            .sort((a, b) => a.localeCompare(b));
        setFilteredSuggestions(filtered);
        setGuess(input);
    };

    // Sets the guess when a suggestion is clicked, and resets the suggestions
    const handleSuggestionClick = (suggestion: string) => {
        setGuess(suggestion);
        setFilteredSuggestions([]);
    };

    // Extract the names of the pokemon into a list, to use for suggestions
    useEffect(() => {
        if (generation) {
            const nameSuggestions = generation.pokemon_species.map((pokemon) => pokemon.name);
            setSuggestions(nameSuggestions);
            console.log("suggestions: ", nameSuggestions);
        }
    }, [generation]);

    return (
        <form onSubmit={handleSubmit} className="guess-form">
            <label htmlFor="guess-input">Who's that Pokemon?</label>
            <div className="input-wrapper">
                <input
                    type="text"
                    id="guess-input"
                    name="guess-input"
                    onChange={handleInput}
                    value={guess}
                    autoComplete="off"
                />
                {filteredSuggestions.length > 0 && guess.trim().length > 0 && (
                    <ul className="suggestions">
                        {filteredSuggestions.map((suggestion) => (
                            <li
                                className={`suggestions__item`}
                                onClick={handleSuggestionClick.bind(null, suggestion)}
                                key={suggestion}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button className="submit-btn" type="submit">
                Guess
            </button>
        </form>
    );
}
