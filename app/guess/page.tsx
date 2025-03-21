import GuessGame from "./GuessGame";

import "./page.css";

export default async function GuessPage() {
    return (
        <main id="guess-page">
            <h1 className="guess-page__title">Pokemon Guesser</h1>
            <GuessGame />
        </main>
    );
}
