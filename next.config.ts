import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  experimental: {
    serverActions: {
       bodySizeLimit: '50mb', // or '50mb' or whatever size you need
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/google/:path*',
        destination: 'https://maps.googleapis.com/maps/api/place/:path*',
      }
    ];
  },
  // ... any other existing config
}

export default nextConfig