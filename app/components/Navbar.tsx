"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import "./Navbar.css";

const NAV_LINKS = [
    { href: "/", name: "Start" },
    { href: "/guess", name: "Guess" },
    { href: "/pokedex", name: "Pokédex" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [navHeight, setNavHeight] = useState<number>(60);
    const navRef = useRef<HTMLElement | null>(null)
    const pathname = usePathname();

    // Close nav once user has navigated
    useEffect(() => {
        setIsOpen(false);
    }, [pathname])

    // Get the nav height to offset top pos (responsive)
    useEffect(() => {
        if (!navRef.current) return;

        setNavHeight(navRef.current.clientHeight);
    }, [])

    return (
        <nav className={`navbar ${isOpen ? "fade-bg" : ""}`} ref={navRef}>
            <div className="nav-links">
                <Link href={"/"} className="logo-link">
                    <Image src={"/PG.svg"} alt={"Pokémon Guesser logo"} width={40} height={40} />
                </Link>

                {/* Visible for small screens */}
                <div className="menu-wrapper" onClick={() => setIsOpen((prevIO) => !prevIO)}>
                    <div className={`nav-menu-btn`}>
                        <div className={`bar ${isOpen ? "open" : ""}`}></div>
                        <div className={`bar ${isOpen ? "open" : ""}`}></div>
                        <div className={`bar ${isOpen ? "open" : ""}`}></div>
                    </div>
                </div>

                <div className={`nav-links__wrapper ${isOpen ? "show" : ""}`} style={{top: `${navHeight}px`}}>
                    {NAV_LINKS.map((navLink) => {
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
            </div>
        </nav>
    );
}
