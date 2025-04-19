"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import NotFoundPage from "@/app/components/NotFoundPage";

export default function NotFound() {
    const pathname = usePathname();
    const pokemonId = pathname.split("/")[2];

    const message = `Could not find pokemon with id: ${pokemonId}`;

    const link = (
        <Link className="link-btn" href={"/pokedex"}>
            BACK TO POKEDEX
        </Link>
    );

    return <NotFoundPage message={message} backElement={link} />;
}
