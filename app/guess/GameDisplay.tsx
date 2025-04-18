import Image from "next/image";

import { Pokemon } from "pokenode-ts";

import Pokeball from "../components/Pokeball";

import { padStartId } from "@/utils/helpers";

import "./GameDisplay.css";

interface IGameDisplay {
    pokemon: Pokemon | undefined;
    pokemonId: string;
    randomNum: number;
    isRevealed: boolean;
    isGameOver: boolean;
    isPokemonLoading: boolean;
}

export default function GameDisplay({
    pokemon,
    pokemonId,
    randomNum,
    isRevealed,
    isGameOver,
    isPokemonLoading,
}: IGameDisplay) {
    const computedGrayScale = isGameOver ? "grayscale" : "";

    // Get the image included in the response if possible, otherwise use a fallback
    const imageExists = pokemon?.sprites.other?.["official-artwork"].front_default;
    const image = imageExists
        ? imageExists
        : `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${padStartId(randomNum)}.png`;

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
                        src={image}
                        alt={"Image of a pokemon silhouette to guess"}
                        width={450}
                        height={450}
                    />
                ) : (
                    <Pokeball className="game-display__loading" loader={"shake"} />
                )}
            </div>
            <figcaption className={`game-display__answer`}>
                {isRevealed ? pokemon?.name : "?"}
            </figcaption>
        </figure>
    );
}
