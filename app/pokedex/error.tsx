"use client";

import ErrorPage from "../components/ErrorPage";

interface IErrorBoundary {
    error: Error;
}

export default function ErrorBoundary({ error }: IErrorBoundary) {
    const button = (
        <button onClick={() => window.location.replace("/pokedex")}>BACK TO POKEDEX</button>
    );

    return <ErrorPage error={error} backElement={button} />;
}
