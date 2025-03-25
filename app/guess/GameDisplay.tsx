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
            {pokemonId && !isPokemonLoading ? (
                <Image
                    className={`game-display__pokemon-image ${isRevealed ? "revealed" : ""}`}
                    src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemonId}.png`}
                    alt={"Image of a pokemon to guess"}
                    width={500}
                    height={500}
                />
            ) : (
                "Loading..."
            )}
            <figcaption className={`game-display__answer`}>{isRevealed ? pokemon : "?"}</figcaption>
        </figure>
    );
}
