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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
experimental: {
},

  async redirects() {
    // no redirects by default
    return [];
  },
    outputFileTracingIncludes: {
    "/api/protect-pdf": ["./vendor/qpdf/**/*"],
  },
};
export default nextConfig;
