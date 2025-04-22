"use client";

import { JSX } from "react";

import Image from "next/image";

import "./ErrorPage.css";

interface IErrorPage {
    error: Error | string;
    backElement?: JSX.Element;
}

export default function ErrorPage({ error, backElement }: IErrorPage) {
    console.log(error);

    const errorMsg = typeof error === "object" ? error.message : error;

    return (
        <div className="error-page">
            <div className="wrapper">
                <h1 className="error-page__title">ERROR</h1>
                <h2 className="error-page__subtitle">{errorMsg}</h2>
                {backElement}
            </div>
            <Image
                className="pikachu"
                src={"/surprised_pikachu.png"}
                alt="Image of surprised pikachu"
                width={500}
                height={416}
            />
        </div>
    );
}
