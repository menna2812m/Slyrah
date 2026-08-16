import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Product photography is served from the Admin/media CDN. Add the real host here.
    remotePatterns: [
      { protocol: "https", hostname: "**.slyrah.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [48, 64, 96, 128, 192, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["zustand"],
  },
};

export default nextConfig;
