import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* Allow pokemon images */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "assets.pokemon.com",
                port: "",
                pathname: "/assets/cms2/img/pokedex/detail/*",
                search: "",
            },
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com",
                port: "",
                pathname: "/HybridShivam/Pokemon/master/assets/images/*",
                search: "",
            },
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com",
                port: "",
                pathname: "/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/*",
                search: "",
            },
        ],
    },
};

export default nextConfig;
