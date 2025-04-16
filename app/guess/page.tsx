import { Metadata } from "next";

import { GameClient } from "pokenode-ts";

import GuessGame from "./GuessGame";

import "./page.css";

export const metadata: Metadata = {
    title: "Guess Game",
    description: "Guess Pokemon based on their silhouette",
};

export default async function GuessPage() {

    const genApi = new GameClient();

    const generations = await genApi.listGenerations();
    console.log("generations:", generations)

    return (
        <main id="guess-page">
            <h1 className="guess-page__title">Pokemon Guesser</h1>
            <GuessGame generations={generations} />
        </main>
    );
}
