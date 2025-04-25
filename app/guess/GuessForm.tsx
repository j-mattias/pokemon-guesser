"use client";

import { useEffect, useState } from "react";
import { Generation } from "pokenode-ts";
import Select, { SingleValue } from "react-select";
import "./GuessForm.css";

interface IGuessForm {
    handleGuess: (guess: string) => void;
    generation: Generation | undefined;
}

interface ISelectOption {
    value: string;
    label: string;
}

export default function GuessForm({ handleGuess, generation }: IGuessForm) {
    const [guess, setGuess] = useState<string>("");
    const [options, setOptions] = useState<ISelectOption[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Prevent form being able to be submitted again while guess is being checked
        setIsProcessing(true);

        // Process the guess
        handleGuess(guess);
        setGuess("");
        setIsProcessing(false);
    };

    // Update the guess when Select option is changed
    const handleChange = (e: SingleValue<ISelectOption>) => {
        if (!e) {
            // Have to clear guess because isClearable doesn't reset input itself
            setGuess("");
            return;
        }
        setGuess(e.value);
    };

    // Extract the pokemon names into an options list for the Select component
    useEffect(() => {
        if (generation) {
            const options = generation.pokemon_species.map((pokemon) => {
                return { value: pokemon.name, label: pokemon.name };
            });
            setOptions(options);
            console.log("options: ", options);
        }
    }, [generation]);

    return (
        <form onSubmit={handleSubmit} className="guess-form">
            <h2 className="guess-form__title">{`Who's that Pokemon?`}</h2>
            <Select
                options={options}
                placeholder="Pokemon"
                id="guess-input"
                onChange={handleChange}
                isClearable={true}
                isDisabled={isProcessing}
                autoFocus={true}
                styles={{
                    control: (baseStyles) => ({
                        ...baseStyles,
                        border: "none",
                        minWidth: "20ch",
                        textTransform: "capitalize",
                    }),
                    valueContainer: (baseStyles) => ({
                        ...baseStyles,
                        paddingLeft: "1rem",
                        ":hover": {
                            cursor: "text",
                        },
                    }),
                    option: (baseStyles) => ({
                        ...baseStyles,
                        textTransform: "capitalize",
                        color: "var(--poke-dark)",
                    }),
                }}
            />
            <button className="submit-btn" disabled={isProcessing} type="submit">
                {isProcessing ? "Checking..." : "Guess"}
            </button>
        </form>
    );
}
