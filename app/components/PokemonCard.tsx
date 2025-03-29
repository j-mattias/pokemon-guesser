"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

import Image from "next/image";

import "./PokemonCard.css";
import { IMousePos } from "./PokemonList";

interface IPokemonCard {
    name: string;
    paddedId: string;
    mousePos: IMousePos;
    windowChange: boolean;
}

export default function PokemonCard({ name, paddedId, mousePos, windowChange }: IPokemonCard) {
    const [cardRect, setCardRect] = useState<DOMRect | null>(null);
    const cardRef = useRef<HTMLElement | null>(null);

    // Update the bounding client when the window changes size
    // Otherwise the effect will be offset incorrectly
    useEffect(() => {
        if (cardRef.current) {
            setCardRect(cardRef.current.getBoundingClientRect());
        }
    }, [windowChange])
    
    // Get left and top position for the card
    const left = cardRect?.left || 0;
    const top = cardRect?.top || 0;

    // Calculate and set the updated position for the radial gradient
    const style = {
        "--mouse-x": `${mousePos.x - left}px`,
        "--mouse-y": `${mousePos.y - top}px`,
    } as CSSProperties;

    return (
        <article className="pokemon-card" style={style} ref={cardRef}>
            <div className="pokemon-card__wrapper">
                <Image
                    src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${paddedId}.png`}
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
