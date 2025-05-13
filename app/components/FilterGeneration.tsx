"use client";

import { CSSProperties, Fragment, useRef, useState } from "react";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { NamedAPIResource } from "pokenode-ts";

import { useCreateQueryString } from "@/utils/customHooks";

import "./FilterGeneration.css";

interface IFilterGeneration {
    generations: NamedAPIResource[];
    gen: string | undefined;
}

export default function FilterGeneration({ generations, gen }: IFilterGeneration) {
    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const radioGroup = "generation-radio";

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Creates a new searchParams string by merging current searchParams
    // with the provided key/value pair
    const createQueryString = useCreateQueryString(searchParams);

    // Update the searchParams when a radio button with a generation is clicked
    const handleClickGen = (value: string | number) => {
        const strValue = typeof value === "number" ? value.toString() : value;
        router.push(`${pathname}?${createQueryString("gen", strValue, true)}`);
    };

    // Clear the generation and page params if all is clicked
    const handleClickAll = () => {
        router.push(`${pathname}`);
    };

    const handleFilterClick = () => {
        setOpen((prev) => !prev);
    };

    return (
        <div className="filter-container">
            <button
                className={`filter-dropdown ${open ? "active" : ""}`}
                onClick={handleFilterClick}
            >
                Filters
            </button>
            <form
                style={
                    {
                        "--filters-max-height": `${open ? ref.current?.scrollHeight : 0}px`,
                    } as CSSProperties
                }
                className={`filter-generations`}
                id="filter-generations"
            >
                <div className={`filters-wrapper`} ref={ref}>
                    <input
                        type="radio"
                        name={radioGroup}
                        id="all"
                        hidden={true}
                        value={`all`}
                        checked={!gen}
                        readOnly
                    />
                    <label
                        className="filter-generations__label"
                        htmlFor="all"
                        onClick={handleClickAll}
                    >
                        All
                    </label>
                    {generations.map((generation, index) => (
                        <Fragment key={generation.name}>
                            <input
                                type="radio"
                                name={radioGroup}
                                id={generation.name}
                                hidden={true}
                                value={index + 1}
                                checked={Number(gen) === index + 1}
                                readOnly
                            />
                            <label
                                className="filter-generations__label"
                                htmlFor={generation.name}
                                onClick={handleClickGen.bind(null, index + 1)}
                            >
                                {generation.name}
                            </label>
                        </Fragment>
                    ))}
                </div>
            </form>
        </div>
    );
}
