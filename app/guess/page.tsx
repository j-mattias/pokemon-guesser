import { Metadata } from "next";
import localFont from "next/font/local";

import { GuessGameContextProvider } from "../contexts/GuessGameContext";
import GuessGame from "./components/GuessGame";
import { fetchGenerations } from "@/utils/dataFetching";

import "./page.css";

export const metadata: Metadata = {
    title: "Guess Game",
    description: "Guess Pokemon based on their silhouette",
};

const pokeFont = localFont({
    src: "../../fonts/itc_kabel_ultra_regular.otf",
    variable: "--poke-font",
    fallback: ["Arial", "Helvetica", "sans-serif"],
});

export default async function GuessPage() {
    const generations = await fetchGenerations();

    return (
        <main id="guess-page" className={pokeFont.variable}>
            <h1 className="guess-page__title">{`Pokémon Guesser`}</h1>
            <GuessGameContextProvider>
                <GuessGame generations={generations} />
            </GuessGameContextProvider>
        </main>
    );
}
