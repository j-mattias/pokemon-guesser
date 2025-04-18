"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import Modal from "@/app/components/Modal";

import "./not-found.css";

export default function NotFound() {
    const pathname = usePathname();
    const pokemonId = pathname.split("/")[2];

    // Need to use router.back in order to close the modal with the back button
    // Updating href with Link component does not work
    const router = useRouter();

    return (
        <Modal>
            <div className="not-found">
                <Image
                    className="unown unown-f"
                    src={"/unown_f.png"}
                    alt="Image of unown F"
                    width={400}
                    height={400}
                />
                <div className="wrapper">
                    <h1 className="not-found__title">404</h1>
                    <h2 className="not-found__subtitle">
                        Could not find pokemon with id: {pokemonId}
                    </h2>
                    <button className="link-btn" onClick={() => router.back()}>
                        BACK TO POKEDEX
                    </button>
                </div>
                <Image
                    className="unown unown-qm"
                    src={"/unown_qm.png"}
                    alt="Image of unown F"
                    width={240}
                    height={404}
                />
            </div>
        </Modal>
    );
}
