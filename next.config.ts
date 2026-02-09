import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hwztchapter.dramaboxdb.com',
      },
      {
        protocol: 'https',
        hostname: 'magma-api.biz.id',
      },
    ],
  },
};

export default nextConfig;
