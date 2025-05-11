import { useGuessGameContext } from "@/app/contexts/GuessGameContext";

import "./GameLives.css";

interface IGameLives {
    className?: string;
}

export default function GameLives({ className = "" }: IGameLives) {
    const { lives, maxLives } = useGuessGameContext();
    const totalLives = Array.from({ length: maxLives }, (_, i) => i);

    return (
        <ul className={`game-lives ${className}`}>
            {totalLives.map((life) => (
                <li className={`game-lives__life ${life < lives ? "" : "lost"}`} key={life}></li>
            ))}
        </ul>
    );
}
