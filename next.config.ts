import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/scanner",
        destination: "/scan",
        permanent: true,
      },
    ];
  },
  experimental: {
    agentUpgrade: "security",
  } as any,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
