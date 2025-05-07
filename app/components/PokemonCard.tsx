"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { IPokemonBasic } from "@/utils/interfaces";

import "./PokemonCard.css";

export default function PokemonCard({ name, paddedId }: IPokemonBasic) {
    const pathname = usePathname();

    return (
        <Link className="pokemon-card-link" href={`${pathname}/${name}`} scroll={false}>
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
