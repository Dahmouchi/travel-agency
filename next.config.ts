import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "pub-8e718d4717894c2d8394aa3ab82551f4.r2.dev",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // or '50mb' or whatever size you need
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/google/:path*",
        destination: "https://maps.googleapis.com/maps/api/place/:path*",
      },
    ];
  },
  // ... any other existing config
};

export default nextConfig;
