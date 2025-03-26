import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Navbar from "./components/Navbar";

import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Pokemon Guesser",
    description: "Guess pokemon based on their silhouette",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable}`}>
                <Navbar/>
                <div id="page-wrapper">
                    {children}
                </div>
            </body>
        </html>
    );
}
