"use client";

import { useEffect, useState } from "react";

import Form from "next/form";

import { debugLog } from "@/utils/helpers";

import "./Search.css";

interface ISearch {
    path: string;
    query?: string | undefined;
}

export default function Search({ path, query }: ISearch) {
    const [input, setInput] = useState<string>(query ?? "");
    debugLog("Search query: ", query);

    // Update the input value when user types
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // Clear the input field if there's no search query
    useEffect(() => {
        if (!query) {
            setInput("");
        }
    }, [query]);

    return (
        <Form action={path} className="search">
            <input
                className="search__input"
                name="query"
                type="search"
                placeholder="Pokémon"
                value={input}
                onChange={handleChange}
            />
            <button className="search__submit" type="submit" disabled={!input.trim()} />
        </Form>
    );
}
