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
            <article className="instructions">
                <div className="instructions__desc">
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
                </div>
                <figure className="instructions__fig">
                    <Image className="instructions__img" src={`/PG_guesser.png`} alt="Image of Pokémon guess game" width={1920} height={1080} />
                </figure>
            </article>
            <article className="instructions">
                <div className="instructions__desc">
                    <h2>Pokedex</h2>
                    <p>{`Browse all Pokémon or pick a generation. Click a Pokémon to get some additional information about that Pokémon.`}</p>
                    <Link className="link-btn" href={`/pokedex`}>
                        Browse
                    </Link>
                </div>
                <figure className="instructions__fig">
                    <Image className="instructions__img" src={`/PG_pokedex.png`} alt="Image of Pokédex" width={1920} height={1080} />
                </figure>
            </article>
        </main>
    );
}
