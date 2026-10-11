import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Room for image uploads (10 MB) and resumes (5 MB) sent through server actions.
    serverActions: { bodySizeLimit: "12mb" },
    // Tree-shake the heavy barrel packages so each page only ships what it uses.
    optimizePackageImports: ["@react-three/drei", "lucide-react", "framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
