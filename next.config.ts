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
        ],
    },
};

export default nextConfig;
