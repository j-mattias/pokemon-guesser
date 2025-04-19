import Link from "next/link";

import NotFoundPage from "./components/NotFoundPage";

export default function NotFound() {
    const button = (
        <Link className="link-btn" href={"/"}>
            BACK TO START
        </Link>
    );

    return <NotFoundPage backElement={button} />;
}
