import Image from "next/image";

import { Pokemon } from "pokenode-ts";

import Pokeball from "../components/Pokeball";

import { TErrorState } from "../contexts/GuessGameContext";

import "./GameDisplay.css";

interface IGameDisplay {
    pokemon: Pokemon | undefined;
    pokemonId: string;
    isRevealed: boolean;
    isGameOver: boolean;
    isPokemonLoading: boolean;
    pokemonFetchError: TErrorState;
    handleRefetchPokemon: () => void;
}

export default function GameDisplay({
    pokemon,
    pokemonId,
    isRevealed,
    isGameOver,
    isPokemonLoading,
    pokemonFetchError,
    handleRefetchPokemon,
}: IGameDisplay) {
    const computedGrayScale = isGameOver ? "grayscale" : "";

    // Get the image included in the response if possible, otherwise use a fallback
    const imageExists = pokemon?.sprites.other?.["official-artwork"].front_default;
    const image = imageExists
        ? imageExists
        : `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemonId}.png`;

    return (
        <div className="game-backdrop">
            <div className="game-display-wrapper">
                <figure className={`game-display ${computedGrayScale}`}>
                    <div className="game-display__image-wrapper">
                        <Image
                            className="game-display__glow-image"
                            src="glow.svg"
                            alt="Shining glow backdrop for pokemon"
                            width={700}
                            height={700}
                        />
                        {pokemonId && !isPokemonLoading && (
                            <Image
                                className={`game-display__pokemon-image ${
                                    isRevealed ? "revealed" : ""
                                }`}
                                src={image}
                                alt={"Image of a pokemon silhouette to guess"}
                                fill={true}
                                sizes="(max-width: 600px) 90vw, (max-width: 1000px) 70vw, 50vw"
                            />
                        )}

                        {isPokemonLoading && (
                            <Pokeball className="game-display__loading" loader={"shake"} />
                        )}

                        {!isPokemonLoading && pokemonFetchError && (
                            <div className="game-display__error">
                                <p>{pokemonFetchError}</p>
                                <button className="retry-btn" onClick={handleRefetchPokemon}>
                                    Retry
                                </button>
                            </div>
                        )}
                    </div>
                    <figcaption className={`game-display__answer`}>
                        {isRevealed ? pokemon?.name : "?"}
                    </figcaption>
                </figure>
            </div>
        </div>
    );
}
