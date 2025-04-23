"use client";

import ErrorPage from "../components/ErrorPage";

interface IErrorBoundary {
    error: Error;
    reset: () => void;
}

export default function ErrorBoundary({ error, reset }: IErrorBoundary) {
    const button = (
        <button onClick={() => window.location.replace("/pokedex")}>BACK TO POKEDEX</button>
    );

    return <ErrorPage error={error} backElement={button} reset={reset} />;
}
