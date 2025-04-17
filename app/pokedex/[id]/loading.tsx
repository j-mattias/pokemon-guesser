import Pokeball from "@/app/components/Pokeball";
import "./loading.css";

export default function Loading() {
    const arr = Array.from({ length: 6 }, (_, index) => index);

    return (
        <div className="loading-details-page">
            <div className="pokemon-wrapper">
                <div className="pokemon-type">
                    <div className="loading-name gradient"></div>
                    <div className="loading-type gradient"></div>
                </div>
                <div className="loading-image">
                    <Pokeball loader="shake" />
                </div>
            </div>
            <div className="details-wrapper">
                <div className="loading-stats">
                    <div className="loading-stats-title gradient"></div>
                    <ul className="loading-stats-list gradient">
                        {arr.map((index) => (
                            <li className="loading-stats-list__item" key={index}></li>
                        ))}
                    </ul>
                </div>
                <div className="loading-abilities">
                    <h3 className="loading-abilities-title gradient"></h3>
                    <ul className="loading-abilities-list gradient">
                        {arr.map((index) => (
                            <li className="loading-abilities-list__item" key={index}></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
