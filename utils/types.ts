import { SingleValue } from "react-select";
import { ISelectSingle } from "./interfaces";

export type TypeColorKeys =
    | "normal"
    | "fire"
    | "water"
    | "electric"
    | "grass"
    | "ice"
    | "fighting"
    | "poison"
    | "ground"
    | "flying"
    | "psychic"
    | "bug"
    | "rock"
    | "ghost"
    | "dragon"
    | "dark"
    | "steel"
    | "fairy"
    | "stellar"
    | "unknown"
    | "shadow";

export type TSingleValue = SingleValue<ISelectSingle>;
