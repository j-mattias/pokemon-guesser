"use client";

import { Fragment } from "react";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { NamedAPIResource } from "pokenode-ts";

import { useCreateQueryString } from "@/utils/customHooks";

import "./FilterGeneration.css";

interface IFilterGeneration {
    generations: NamedAPIResource[];
}

export default function FilterGeneration({ generations }: IFilterGeneration) {
    const radioGroup = "generation-radio";

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const genParam = searchParams.get("gen");

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

    return (
        <form className="filter-generations" id="filter-generations">
            <input
                type="radio"
                name={radioGroup}
                id="all"
                hidden={true}
                value={`all`}
                defaultChecked={!genParam}
            />
            <label className="filter-generations__label" htmlFor="all" onClick={handleClickAll}>
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
                        defaultChecked={Number(genParam) === index + 1}
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
        </form>
    );
}
