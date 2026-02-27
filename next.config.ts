import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.tiktokcdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.tiktokcdn-us.com',
      },
      {
        protocol: 'https',
        hostname: 'p16-sign.tiktokcdn-us.com',
      },
      {
        protocol: 'https',
        hostname: 'p16-common-sign.tiktokcdn-us.com',
      },
      {
        protocol: 'https',
        hostname: '*.musical.ly',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Shopify
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;