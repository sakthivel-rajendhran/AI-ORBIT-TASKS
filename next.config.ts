import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    '10.218.158.209',
    '10.218.*.*',
    'localhost',
    '127.0.0.1',
  ],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
