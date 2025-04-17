import Pokeball from "@/app/components/Pokeball";

import "./loading.css";

export default function Loading() {
    return (
        <div className="loading-modal-overlay">
            <div className="loading-modal">
                <Pokeball loader="shake" />
            </div>
        </div>
    );
}
