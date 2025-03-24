"use client";

import { useEffect, useState } from "react";
import { GameClient } from "pokenode-ts";
import "./GuessForm.css";

interface IGuessForm {
    handleGuess: (guess: string) => void;
    generation: number;
}

export default function GuessForm({ handleGuess, generation }: IGuessForm) {
    const [guess, setGuess] = useState<string>("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

    const genApi = new GameClient({ logs: true });
    
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

    // Fetch the list of pokemon for the given generation
    useEffect(() => {
        const fetchGeneration = async (gen: number) => {
            try {
                // API complains but if you don't includee the / it doesn't work
                const genPokemonList = await genApi.getGenerationById(gen);
                console.log("List, ", genPokemonList);

                const list = genPokemonList.pokemon_species.map((pokemon) => pokemon.name);
                setSuggestions(list);
                console.log("suggestions: ", suggestions, list);
            } catch (error) {
                console.error(error);
            }
        };
        fetchGeneration(generation);
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
