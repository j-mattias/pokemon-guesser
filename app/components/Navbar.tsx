"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import "./Navbar.css";

const navLinks = [
    { href: "/", name: "Start" },
    { href: "/guess", name: "Guess" },
    { href: "/pokedex", name: "Pokedex" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link href={"/"} className="logo-link">
                    PG
                </Link>
                {navLinks.map((navLink) => {
                    const isActive =
                        navLink.href === pathname ||
                        (pathname.startsWith(navLink.href) && navLink.href !== "/");

                    return (
                        <Link
                            className={`nav-links__link ${isActive ? "active-link" : ""}`}
                            href={navLink.href}
                            key={navLink.name}
                        >
                            {navLink.name}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
