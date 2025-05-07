"use client";

import { usePathname, useRouter } from "next/navigation";

import Modal from "@/app/components/Modal";
import NotFoundPage from "@/app/components/NotFoundPage";

import "./not-found.css";

export default function NotFound() {
    const pathname = usePathname();
    const pokemonName = pathname.split("/")[2];

    const message = `Could not find pokemon with name: ${pokemonName}`;

    // Need to use router.back in order to close the modal with the back button
    // Updating href with Link component does not work
    const router = useRouter();

    const button = <button onClick={() => router.back()}>BACK TO POKEDEX</button>;

    return (
        <Modal>
            <NotFoundPage message={message} backElement={button} />
        </Modal>
    );
}
