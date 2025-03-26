import Image from "next/image";

import "./GameDisplay.css";

interface IGameDisplay {
    pokemonId: string;
    isPokemonLoading: boolean;
    isRevealed: boolean;
    pokemon: string;
}

export default function GameDisplay({
    pokemonId,
    isPokemonLoading,
    isRevealed,
    pokemon,
}: IGameDisplay) {
    return (
        <figure className="game-display">
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
                        src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemonId}.png`}
                        alt={"Image of a pokemon to guess"}
                        width={450}
                        height={450}
                    />
                ) : (
                    <p className="game-display__loading">Loading...</p>
                )}
            </div>
            <figcaption className={`game-display__answer`}>{isRevealed ? pokemon : "?"}</figcaption>
        </figure>
    );
}
