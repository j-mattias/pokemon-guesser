"use client";

import { useSearchParams } from "next/navigation";

import NotFoundPage from "../components/NotFoundPage";

export default function NotFound() {
    const params = useSearchParams();

    // Create a string with problematic parameters
    let str = "";
    for (const [key, value] of params.entries()) {
        str += `${key}: ${value} `;
    }
    const message = `Page not found for ${str}`;

    // Router methods did not work, had to use location method instead
    const handleClick = () => {
        window.location.replace("/pokedex");
    };

    const button = (
        <button onClick={handleClick}>BACK TO POKEDEX</button>
    );

    return <NotFoundPage message={message} backElement={button} />;
}
