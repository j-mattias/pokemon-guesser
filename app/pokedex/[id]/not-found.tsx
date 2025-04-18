"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NotFound() {
    const pathname = usePathname();
    const pokemonId = pathname.split("/")[2];

    return (
        <div className="not-found">
            <Image
                className="unown unown-f"
                src={"/unown_f.png"}
                alt="Image of unown F"
                width={400}
                height={400}
            />
            <div className="wrapper">
                <h1 className="not-found__title">404</h1>
                <h2 className="not-found__subtitle">Could not find pokemon with id: {pokemonId}</h2>
                <Link className="link-btn" href={"/pokedex"}>
                    BACK TO POKEDEX
                </Link>
            </div>
            <Image
                className="unown unown-qm"
                src={"/unown_qm.png"}
                alt="Image of unown F"
                width={240}
                height={404}
            />
        </div>
    );
}
