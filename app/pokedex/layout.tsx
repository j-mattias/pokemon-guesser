import React from "react";

interface IPokedexLayout {
    modal: React.ReactNode;
    children: React.ReactNode;
}

export default function PokedexLayout({ modal, children }: IPokedexLayout) {
    return (
        <>
            {modal}
            {children}
        </>
    );
}
