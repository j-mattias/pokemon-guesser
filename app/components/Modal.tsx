"use client";

import { useRouter } from "next/navigation";
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";

import "./Modal.css";

interface IModal {
    children: React.ReactNode;
}

type TRef = HTMLDivElement | null;

export default function Modal({ children }: IModal) {
    const [scrollbarWidth, setScrollbarWidth] = useState<number>(0);
    const [modalBottom, setBottom] = useState<number>(0);
    const [hideFade, setHideFade] = useState<boolean>(true);

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

    // Ensure fade is at the bottom when scrolling and turn it off when scroll hits bottom
    const handleScroll = useCallback(() => {
        if (!modalRef.current) return;

        // Get modal height, scrollHeight and how far it's scrolled from the top
        const height = modalRef.current.offsetHeight;
        const scrollHeight = modalRef.current.scrollHeight;
        const scrollTop = modalRef.current.scrollTop;

        // Update bottom value when modal scrolls
        setBottom(scrollTop);

        // Hide fade when scroll is at bottom
        if (scrollTop < scrollHeight - height) {
            setHideFade(false);
        } else {
            setHideFade(true);
        }
    }, []);

    // Add a listener for keydown on mount, and remove it once it's been pressed
    useEffect(() => {
        // Close the modal if Escape is pressed
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    // Calculate the scrollbar width, otherwise modal will be slightly offset
    useEffect(() => {
        const scrollbarWidth = window.innerWidth - document.body.clientWidth;
        setScrollbarWidth(scrollbarWidth);
    }, []);

    // Ensure fade is hidden unless modal is scrollable
    useEffect(() => {
        if (!modalRef.current) return;
        handleScroll();
    }, [handleScroll]);

    return (
        <div
            className="modal-overlay"
            ref={overlayRef}
            onClick={handleClose}
            style={{ "--scrollbarWidth": `${scrollbarWidth}px` } as React.CSSProperties}
        >
            <div
                className={`modal ${hideFade ? "hide-fade" : ""}`}
                ref={modalRef}
                onScroll={handleScroll}
                style={{ "--modal-bottom": `-${modalBottom}px` } as React.CSSProperties}
            >
                <div className="modal-x" ref={xRef}></div>
                {children}
            </div>
        </div>
    );
}
