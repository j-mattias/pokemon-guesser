import Link from "next/link";

import "./not-found.css";
import Image from "next/image";

export default function NotFound() {
    return (
        <main id="not-found">
            <Image
                className="unown unown-f"
                src={"/unown_f.png"}
                alt="Image of unown F"
                width={400}
                height={400}
            />
            <div className="wrapper">
                <h1 className="not-found__title">404</h1>
                <h2 className="not-found__subtitle">Page not found</h2>
                <Link className="link-btn" href={"/"}>
                    BACK TO START
                </Link>
            </div>
            <Image
                className="unown unown-qm"
                src={"/unown_qm.png"}
                alt="Image of unown F"
                width={240}
                height={404}
            />
        </main>
    );
}
