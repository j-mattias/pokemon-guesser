import Link from "next/link";

import "./Pagination.css";

interface IPagination {
    pages: number;
    currentPage: number;
}

export default function Pagination({ pages, currentPage }: IPagination) {
    // Create an array with indexes based on the amount of pages
    const numPages = Array.from({ length: pages }, (_, i) => i + 1);
    console.log(numPages);

    return (
        <div className="pagination-wrapper">
            <ul className="pagination">
                {/* First */}
                {currentPage > 1 && (
                    <li className="pagination__item">
                        <Link className={`pagination__link`} href={`/pokedex/?page=${1}`}>
                            &#171;
                        </Link>
                    </li>
                )}

                {/* Prev */}
                {currentPage > 1 && (
                    <li className="pagination__item">
                        <Link
                            className={`pagination__link`}
                            href={`/pokedex/?page=${currentPage - 1}`}
                        >
                            &#x2039;
                        </Link>
                    </li>
                )}

                {numPages.map((page) => {
                    // Limit links rendered to 2 before/after currentPage
                    if (page > currentPage + 2 || page < currentPage - 2) return null;

                    const activeLink = currentPage === page ? "active_link" : "";

                    return (
                        <li className={`pagination__item`} key={page}>
                            <Link
                                className={`pagination__link ${activeLink}`}
                                href={`/pokedex/?page=${page}`}
                            >
                                {page}
                            </Link>
                        </li>
                    );
                })}

                {/* Next */}
                {currentPage < pages && (
                    <li className="pagination__item">
                        <Link
                            className={`pagination__link`}
                            href={`/pokedex/?page=${currentPage + 1}`}
                        >
                            &#x203A;
                        </Link>
                    </li>
                )}

                {/* Last */}
                {currentPage < pages && (
                    <li className="pagination__item">
                        <Link className={`pagination__link`} href={`/pokedex/?page=${pages}`}>
                            &#187;
                        </Link>
                    </li>
                )}
            </ul>
            <div className="current-page">
                {currentPage} / {pages}
            </div>
        </div>
    );
}
