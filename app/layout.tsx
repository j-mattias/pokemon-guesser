import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Navbar from "./components/Navbar";

import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
    title: {
        default: "Pokémon Guesser",
        template: "%s | Pokémon Guesser",
    },
    description: "Play a Pokémon guessing game or browse Pokémon",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable}`}>
                <header>
                    <Navbar />
                </header>
                <div id="page-wrapper">{children}</div>
            </body>
        </html>
    );
}
