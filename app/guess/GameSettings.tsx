import { NamedAPIResourceList } from "pokenode-ts";

import "./GameSettings.css";

interface IGameSettings {
    isGameActive: boolean;
    generations: NamedAPIResourceList;
    generationNum: number;
    handleSelectGeneration: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSetIsGameActive: (bool: boolean) => void;
    isGenLoading: boolean;
}

export default function GameSettings({
    isGameActive,
    generations,
    generationNum,
    handleSelectGeneration,
    handleSetIsGameActive,
    isGenLoading,
}: IGameSettings) {
    // If the game is active, don't show game settings
    if (isGameActive) return null;

    return (
        <>
            <form className="game-settings">
                <label className="game-settings__label" htmlFor="generations">
                    Pick a generation
                </label>
                <select
                    id="generations"
                    onChange={handleSelectGeneration}
                    defaultValue={`${generationNum}`}
                >
                    {generations.results.map((gen, index) => (
                        <option key={gen.name} value={index + 1}>
                            {gen.name.toUpperCase()}
                        </option>
                    ))}
                </select>
                <button className="start-game" disabled={isGenLoading} onClick={() => handleSetIsGameActive(true)}>
                    {isGenLoading ? "Loading..." : "Play"}
                </button>
            </form>
        </>
    );
}
