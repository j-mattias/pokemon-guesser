import { JSX } from "react";

import Image from "next/image";

import "./NotFoundPage.css";

interface INotFound {
    message?: string;
    backElement: JSX.Element;
}

export default function NotFoundPage({ message = "Page not found", backElement }: INotFound) {
    return (
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
                <h2 className="not-found__subtitle">{message}</h2>
                {backElement}
            </div>
            <Image
                className="unown unown-qm"
                src={"/unown_qm.png"}
                alt="Image of unown question mark"
                width={240}
                height={404}
            />
        </div>
    );
}
