import Image from "next/image";
import { notFound } from "next/navigation";

import { PokemonClient } from "pokenode-ts";

import Modal from "@/app/components/Modal";
import { getTypeColor, padStartId, replaceCharWithSpace } from "@/utils/helpers";
import { POKEMON_MAX_COUNT } from "@/data/globalVariables";

import "./page.css";

interface IPokedexModal {
    params: Promise<{ id: string }>;
}

export default async function PokedexModal({ params }: IPokedexModal) {
    const { id } = await params;
    const numId = parseInt(id);

    // Trigger a notFound response if id is below 1 or above POKEMON_MAX_COUNT (1025)
    if (numId < 1 || numId > POKEMON_MAX_COUNT) {
        notFound();
    }

    const pokeApi = new PokemonClient();
    const pokemon = await pokeApi.getPokemonById(numId);

    const imageExists = pokemon.sprites.other?.["official-artwork"].front_default;
    const image = imageExists
        ? imageExists
        : `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${padStartId(pokemon.id)}.png`;

    return (
        <Modal>
            <div className="pokedex-modal">
                <div className="pokemon-wrapper">
                    <figure className="pokemon-image">
                        <Image
                            src={image}
                            alt={`Image of ${pokemon.name}`}
                            width={500}
                            height={500}
                        />
                    </figure>
                    <div className="pokemon-type">
                        <h2 className="pokemon-name">{pokemon.name}</h2>
                        <ul className="pokemon-type-list">
                            {pokemon.types.map((type) => (
                                <li
                                    className="pokemon-type-list__item"
                                    key={type.slot}
                                    style={{ backgroundColor: `${getTypeColor(type.type.name)}` }}
                                >
                                    {type.type.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="details-wrapper">
                    <div className="pokemon-stats">
                        <h3 className="pokemon-stats-title">Stats</h3>
                        <ul className="pokemon-stats-list">
                            {pokemon.stats.map((stat) => (
                                <li className="pokemon-stats-list__item" key={stat.stat.name}>
                                    <p>{replaceCharWithSpace(stat.stat.name, "-")}:</p>
                                    <p>{stat.base_stat}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="pokemon-abilities">
                        <h3 className="pokemon-abilities-title">Abilities</h3>
                        <ul className="pokemon-abilities-list">
                            {pokemon.abilities.map((ability) => (
                                <li className="pokemon-abilities-list__item" key={ability.slot}>
                                    {replaceCharWithSpace(ability.ability.name, "-")}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
