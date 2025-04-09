"use client";

import { useRouter } from "next/navigation";
import { MouseEventHandler, useCallback, useEffect, useRef } from "react";

import "./Modal.css";

interface IModal {
    children: React.ReactNode;
}

type TRef = HTMLDivElement | null;

export default function Modal({ children }: IModal) {
    const overlayRef = useRef<TRef>(null);
    const modalRef = useRef<TRef>(null);
    const xRef = useRef<TRef>(null);
    const router = useRouter();

    // Navigate back to close the modal
    const onClose = useCallback(() => {
        router.back();
    }, [router]);

    // Close the modal if the overlay or modal is clicked
    const handleClose: MouseEventHandler = useCallback(
        (e) => {
            if (
                e.target === overlayRef.current ||
                e.target === modalRef.current ||
                e.target === xRef.current
            ) {
                onClose();
            }
        },
        [onClose, overlayRef, modalRef, xRef]
    );

    // Close the modal if Escape is pressed
    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        },
        [onClose]
    );

    // Add a listener for keydown on mount, and remove it once it's been pressed
    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onKeyDown]);

    return (
        <div className="modal-overlay" ref={overlayRef} onClick={handleClose}>
            <div className="modal" ref={modalRef}>
                <div className="modal-x" ref={xRef}></div>
                {children}
            </div>
        </div>
    );
}
