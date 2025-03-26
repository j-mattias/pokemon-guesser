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
        ],
    },
};

export default nextConfig;
