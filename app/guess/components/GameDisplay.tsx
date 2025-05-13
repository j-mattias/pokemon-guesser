import Image from "next/image";

import { Pokemon } from "pokenode-ts";

import Pokeball from "../../components/Pokeball";
import GameLives from "./GameLives";

import { TErrorState } from "../../contexts/GuessGameContext";

import "./GameDisplay.css";

interface IGameDisplay {
    pokemon: Pokemon | undefined;
    pokemonId: string;
    isRevealed: boolean;
    isGameOver: boolean;
    isWrongGuess: boolean;
    isPokemonLoading: boolean;
    pokemonFetchError: TErrorState;
    handleRefetchPokemon: () => void;
}

export default function GameDisplay({
    pokemon,
    pokemonId,
    isRevealed,
    isGameOver,
    isWrongGuess,
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
                            width={650}
                            height={650}
                        />
                        {pokemonId && !isPokemonLoading && (
                            <Image
                                className={`game-display__pokemon-image ${
                                    isRevealed ? "revealed" : ""
                                }`}
                                src={image}
                                alt={"Image of a pokemon silhouette to guess"}
                                width={450}
                                height={450}
                            />
                        )}

                        {isPokemonLoading && (
                            <div className="game-display__loading">
                                <Pokeball className="game-display__pokeball" loader={"shake"} />
                            </div>
                        )}

                        {!isPokemonLoading && pokemonFetchError && (
                            <div className="game-display__error">
                                <p>{pokemonFetchError}</p>
                                <button className="retry-btn" onClick={handleRefetchPokemon}>
                                    Retry
                                </button>
                            </div>
                        )}
                        {(isWrongGuess || isGameOver) && (
                            <Image
                                className="game-display__incorrect"
                                src={"/incorrect_x.svg"}
                                alt="X indicating incorrect guess."
                                width={300}
                                height={300}
                            />
                        )}
                    </div>
                    <figcaption className={`game-display__answer`}>
                        {isRevealed ? pokemon?.name : <span className="question-mark">?</span>}
                    </figcaption>
                    <GameLives className="game-display__lives" />
                </figure>
            </div>
        </div>
    );
}
