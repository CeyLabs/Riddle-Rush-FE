import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
        remotePatterns: [
      {
        protocol: 'https',
        hostname: 't.me',
      },
    ],
  }
  /* config options here */
};

export default nextConfig;
