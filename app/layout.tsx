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
        default: "Pokemon Guesser",
        template: "%s | Pokemon Guesser",
    },
    description: "Play a Pokemon guessing game or browse Pokemon",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable}`}>
                <Navbar />
                <div id="page-wrapper">{children}</div>
            </body>
        </html>
    );
}
