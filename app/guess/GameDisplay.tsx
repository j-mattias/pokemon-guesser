import { useEffect, useState } from "react";

import Image from "next/image";

import { MainClient, Pokemon } from "pokenode-ts";

import Pokeball from "../components/Pokeball";

import { padStartId } from "@/utils/helpers";

import "./GameDisplay.css";

interface IGameDisplay {
    isRevealed: boolean;
    isGameOver: boolean;
    randomNum: number;
    handleSetPokemon: (pokemonName: string) => void;
}

export default function GameDisplay({
    isRevealed,
    isGameOver,
    randomNum,
    handleSetPokemon,
}: IGameDisplay) {
    const [pokemon, setPokemon] = useState<Pokemon | undefined>(undefined);
    const [pokemonId, setPokemonId] = useState<string>("")
    const [isPokemonLoading, setIsPokemonLoading] = useState<boolean>(true);

    const pokeApi = new MainClient({ logs: true });

    const computedGrayScale = isGameOver ? "grayscale" : "";

    // Get the image included in the response if possible, otherwise use a fallback
    const imageExists = pokemon?.sprites.other?.["official-artwork"].front_default;
    const image = imageExists
        ? imageExists
        : `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${padStartId(randomNum)}.png`;

    useEffect(() => {
        setIsPokemonLoading(true);

        // Fetch a random pokemon by id
        const fetchPokemon = async (id: number) => {
            try {
                const pokemon = await pokeApi.pokemon.getPokemonById(id);
                setPokemon(pokemon);
                console.log("fetched pokemon: ", pokemon.name);

                // Convert the pokemon id to a 3 digit string, compatible with the image url
                const pokemonId = padStartId(id);
                setPokemonId(pokemonId);

                // Update the pokemon name, for checking correct guess
                handleSetPokemon(pokemon.name);

                setIsPokemonLoading(false);
            } catch (error) {
                console.error(error);
                setIsPokemonLoading(false);
            }
        };
        fetchPokemon(randomNum);
    }, [randomNum])

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
