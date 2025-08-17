import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow warnings during build, only fail on errors
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Allow type errors during build for now
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
