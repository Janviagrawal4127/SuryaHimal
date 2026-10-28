import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin image sources (Unsplash, etc.)
  images: {
    domains: [],
  },
  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
};

export default nextConfig;
