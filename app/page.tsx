import Link from "next/link";
import Image from "next/image";

import "./page.css";

export default function Start() {
    return (
        <main className="start spotlight-bg">
            <div className="title-wrapper">
                <Image className="start-logo" src={"/PG.svg"} alt="Pokemon Guesser logo" width={200} height={200} />
                <h1 className="start-title">{`Pokémon Guesser`}</h1>
            </div>
            <article className="instructions instructions--guesser">
                <h2>Guess</h2>
                <p>
                    {`The game is based on the "Who's that Pokémon" segment from the Pokémon TV show. The siloutte of a Pokémon will be displayed. Type
                    your guess into the input field*. If you guess correctly, hit the “Next” button
                    to proceed to the next Pokémon. Guess all of them correctly to win.`}
                </p>
                <ol>
                    <li>{`Select a Pokémon generation.`}</li>
                    <li>{`Make your guess based on the Pokémon's silhoutte.`}</li>
                </ol>
                <small className="disclaimer">{`*Suggestions will be displayed based on what you type. Some Pokémon have special spellings, ex. Mr. Mime → Mr-Mime, use the suggestions to ensure the name is correct.`}</small>
                <Link className="link-btn" href={`/guess`}>
                    Play
                </Link>
            </article>
            <article className="instructions instructions--pokedex">
                <h2>Pokedex</h2>
                <p>{`Browse all Pokémon or pick a generation. Click a Pokémon to get some additional information about that Pokémon.`}</p>
                <Link className="link-btn" href={`/pokedex`}>
                    Browse
                </Link>
            </article>
        </main>
    );
}
