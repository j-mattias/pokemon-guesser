"use client";

import { useEffect, useState } from "react";

import { NamedAPIResource } from "pokenode-ts";
import Select from "react-select";

import { TSingleValue } from "@/utils/types";

import "./GameSettings.css";

interface IGameSettings {
    isGameActive: boolean;
    generations: NamedAPIResource[];
    handleSelectGeneration: (option: TSingleValue) => void;
    handleSetIsGameActive: (bool: boolean) => void;
    isGenLoading: boolean;
}

export default function GameSettings({
    isGameActive,
    generations,
    handleSelectGeneration,
    handleSetIsGameActive,
    isGenLoading,
}: IGameSettings) {
    const [isClient, setIsClient] = useState<boolean>(false);

    // Setup the options list for the Select component
    const options = generations.map((gen, index) => {
        return { value: index + 1, label: gen.name };
    });

    // Ensure that the Select component renders the same content server-side as it does 
    // during the initial client-side render to prevent a hydration mismatch.
    useEffect(() => {
        setIsClient(true);
    }, []);

    // If the game is active, don't show game settings
    if (isGameActive) return null;

    return (
        <>
            <form className="game-settings">
                <h2 className="game-settings__title">Pick a generation</h2>
                {isClient ? (
                    <Select
                        options={options}
                        defaultValue={options[0]}
                        onChange={handleSelectGeneration}
                        isSearchable={false}
                        isDisabled={isGenLoading}
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                border: "none",
                            }),
                            valueContainer: (baseStyles) => ({
                                ...baseStyles,
                                textTransform: "uppercase",
                            }),
                            option: (baseStyles) => ({
                                ...baseStyles,
                                textTransform: "uppercase",
                                color: "var(--poke-dark)",
                            }),
                        }}
                    />
                ) : (
                    <div className="select-placeholder"></div>
                )}
                <button
                    className="start-game"
                    disabled={isGenLoading}
                    onClick={() => handleSetIsGameActive(true)}
                >
                    {isGenLoading ? "Loading..." : "Play"}
                </button>
            </form>
        </>
    );
}
