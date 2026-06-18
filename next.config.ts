import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,      // recommended
  compiler: {
    // SWC minification is default, no need for swcMinify
  },
  serverExternalPackages: ["@prisma/client"], // optional: external packages used in server components
  typescript: {
    ignoreBuildErrors: false, // strict TS checking
  },
  images: {
    domains: [], // add external domains if needed
  },
  experimental: {
    // empty or remove appDir if already default
  },
  async redirects() {
    // no redirects by default
    return [];
  },
};
export default nextConfig;
