import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Obrazy z panelu afto.works (CMS)
    remotePatterns: [
      { protocol: "https", hostname: "www.afto.works" },
      { protocol: "https", hostname: "afto.works" },
    ],
  },
};

export default nextConfig;
