import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost:3004", "192.168.1.35:3004"],
  },
};

export default nextConfig;
