import "./loading.css";

export default function Loading() {
    return (
        <div className="loading">
            <h1 className="loading__title">Pokedex</h1>
            <div className="filters-loading">
                {Array.from({ length: 9 }, (_, index) => index).map((item) => (
                    <div className="filters-loading__item" key={item}></div>
                ))}
            </div>
            <div className="list-loading">
                {Array.from({ length: 40 }, (_, index) => index).map((item) => (
                    <div className="list-loading__item" key={item}></div>
                ))}
            </div>
        </div>
    );
}
