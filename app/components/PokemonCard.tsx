"use client";

import { memo } from "react";

import Image from "next/image";
import Link from "next/link";

import { IPokemonBasic } from "@/utils/interfaces";

import "./PokemonCard.css";

function PokemonCardBase({ name, paddedId, href }: IPokemonBasic) {
    return (
        <Link className="pokemon-card-link" href={href} scroll={false}>
            <article className="pokemon-card">
                <Image
                    src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`}
                    alt={`Image of ${name}`}
                    width={100}
                    height={100}
                    className="pokemon-card__image"
                />
                <h3 className="pokemon-card__title">{name}</h3>
            </article>
        </Link>
    );
}

const PokemonCard = memo(PokemonCardBase);
export default PokemonCard;
