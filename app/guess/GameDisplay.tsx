import Image from "next/image";

import Pokeball from "../components/Pokeball";

import "./GameDisplay.css";

interface IGameDisplay {
    pokemonId: string;
    isPokemonLoading: boolean;
    isRevealed: boolean;
    pokemon: string;
    isGameOver: boolean;
}

export default function GameDisplay({
    pokemonId,
    isPokemonLoading,
    isRevealed,
    pokemon,
    isGameOver,
}: IGameDisplay) {
    const computedGrayScale = isGameOver ? "grayscale" : "";

    return (
        <figure className={`game-display ${computedGrayScale}`}>
            <div className="game-display__image-wrapper">
                <Image
                    className="game-display__glow-image"
                    src="glow.svg"
                    alt="Shining glow backdrop for pokemon"
                    width={700}
                    height={700}
                />
                {pokemonId && !isPokemonLoading ? (
                    <Image
                        className={`game-display__pokemon-image ${isRevealed ? "revealed" : ""}`}
                        src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokemonId}.png`}
                        alt={"Image of a pokemon to guess"}
                        width={450}
                        height={450}
                    />
                ) : (
                    <Pokeball className="game-display__loading" loader={"shake"} />
                )}
            </div>
            <figcaption className={`game-display__answer`}>{isRevealed ? pokemon : "?"}</figcaption>
        </figure>
    );
}
