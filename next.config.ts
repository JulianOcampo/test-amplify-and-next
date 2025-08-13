import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [
      "ffmpeg-static",
      "puppeteer",
      "puppeteer-core",
      "@sparticuz/chromium"
    ],
    /** @ts-ignore */
    outputFileTracingIncludes: {
      '/**/*': ['./node_modules/ffmpeg-static/ffmpeg']
    }
  }
};

export default nextConfig;
