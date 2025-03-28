import "./Pokeball.css";

interface IPokeball {
    className?: string;
    loader?: "shake" | "spin";
    scale?: number;
}

export default function Pokeball({ className, loader, scale=2 }: IPokeball) {
    const style = {
        "--pokeball-scale": scale,
    } as React.CSSProperties;

    return (
        <div className={`pokeball ${loader} ${className}`} style={style}>
            <div className="pokebutton"></div>
        </div>
    );
}
