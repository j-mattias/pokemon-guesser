"use client";

import Link from "next/link";

import ErrorPage from "../components/ErrorPage";

interface IErrorBoundary {
    error: Error;
    reset: () => void;
}

export default function ErrorBoundary({ error, reset }: IErrorBoundary) {
    const link = (
        <Link className="link-btn" href={`/`}>
            Back to Start
        </Link>
    );

    return <ErrorPage error={error} reset={reset} backElement={link} />;
}
