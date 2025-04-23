"use client";

import { Inter } from "next/font/google";

import ErrorPage from "./components/ErrorPage";

import "./globals.css";
import "./components/ErrorPage.css";

interface IGlobalError {
    error: Error;
}

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    fallback: ["Arial", "Helvetica", "sans-serif"],
});

export default function GlobalError({ error }: IGlobalError) {
    const handleReset = () => {
        window.location.reload();
    };

    return (
        <html>
            <body className={`${inter.variable}`}>
                <div id="page-wrapper">
                    <ErrorPage error={error.message} reset={handleReset} />
                </div>
            </body>
        </html>
    );
}
