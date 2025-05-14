"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import debounce from "debounce";

import { debugLog } from "@/utils/helpers";

import "./Search.css";

interface ISearch {
    query?: string;
    placeholder?: string;
}

export default function Search({ placeholder = "Search", query = "" }: ISearch) {
    const [input, setInput] = useState<string>(query);

    const router = useRouter();
    const pathname = usePathname();

    // Debounce updating searchQuery to reduce requests
    const debounceInputQuery = debounce((searchQuery: string) => {
        // Reset any params
        const params = new URLSearchParams();
        debugLog("Search query: ", searchQuery);

        // If query is empty remove the query, otherwise update URL with query
        if (!searchQuery.trim()) {
            params.delete("query");
        } else {
            params.set("query", searchQuery);
        }
        router.push(`${pathname}?${params.toString()}`);
    }, 300);

    // Update the input value and search param when user types
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = e.target.value;

        // Prevent empty strings
        if (searchQuery.length > 0 && !searchQuery.trim()) return;

        setInput(searchQuery);
        debounceInputQuery(searchQuery);
    };

    // Clear the input field if there's no search query
    useEffect(() => {
        if (!query) {
            setInput("");
        }
    }, [query]);

    return (
        <form className="search">
            <input
                className="search__input"
                name="query"
                type="search"
                placeholder={placeholder}
                value={input}
                onChange={handleChange}
            />
            <button className="search__submit" type="submit" disabled={!input.trim()} />
        </form>
    );
}
