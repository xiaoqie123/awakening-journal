import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standard server output (not static export) since API routes need fs
  images: {
    // Allow any external image sources needed for content or avatars
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Disable image optimization in dev if needed
    unoptimized: process.env.NODE_ENV === "development",
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Redirect legacy routes
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/journal",
        destination: "/write",
        permanent: true,
      },
    ];
  },

  // Turbopack config (Next.js 16+)
  turbopack: {},

  // Exclude data directory from the build
  // (data is read at runtime, not bundled)
  serverExternalPackages: [],
};

export default nextConfig;
