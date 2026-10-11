import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Tree-shake the heavy barrel packages so each page only ships what it uses.
    optimizePackageImports: ["@react-three/drei", "lucide-react", "framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
