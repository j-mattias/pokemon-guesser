import Pokeball from "../components/Pokeball";

import "./loading.css";

export default function Loading() {
    return (
        <div className="guess-loading">
            <h1 className="guess-page__title">Pokemon Guesser</h1>
            <Pokeball loader="spin" className="guess-loader" />
        </div>
    );
}
