import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default 1MB is too small for raw phone photos (Kakou photo AI review).
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
