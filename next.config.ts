import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        serverComponentsExternalPackages: [
            "puppeteer-core",
            "@sparticuz/chromium"
        ],

    }
};

export default nextConfig;
