"use client";

import Image from "next/image";

import { IPokemonBasic } from "@/utils/interfaces";

import "./PokemonCard.css";

export default function PokemonCard({ name, paddedId }: IPokemonBasic) {

    return (
        <article className="pokemon-card">
            <div className="pokemon-card__wrapper">
                <Image
                    src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`}
                    alt={`Image of ${name}`}
                    width={100}
                    height={100}
                    className="pokemon-card__image"
                />
                <h3 className="pokemon-card__title">{name}</h3>
            </div>
        </article>
    );
}
