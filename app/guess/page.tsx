import { Metadata } from "next";

import { GuessGameContextProvider } from "../contexts/GuessGameContext";
import GuessGame from "./GuessGame";
import { fetchGenerations } from "@/utils/dataFetching";

import "./page.css";

export const metadata: Metadata = {
    title: "Guess Game",
    description: "Guess Pokemon based on their silhouette",
};

export default async function GuessPage() {
    const generations = await fetchGenerations();

    return (
        <main id="guess-page">
            <h1 className="guess-page__title">{`Pokémon Guesser`}</h1>
            <GuessGameContextProvider>
                <GuessGame generations={generations} />
            </GuessGameContextProvider>
        </main>
    );
}
