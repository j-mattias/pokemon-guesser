import Pokeball from "../components/Pokeball";

import "./loading.css";

export default function Loading() {
    return (
        <div className="guess-loading">
            <h1 className="guess-page__title">{`Pokémon Guesser`}</h1>
            <div className="loader">
                <Pokeball loader="spin" className="guess-loader" scale={4} />
            </div>
        </div>
    );
}
