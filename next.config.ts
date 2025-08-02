import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@prisma/client": require.resolve("@prisma/client"),
    };
    return config;
  },
};

export default nextConfig;