import type { NextConfig } from "next";

const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Short links live on this domain and are served by the Express API (../server).
  async rewrites() {
    return [{ source: "/s/:path*", destination: `${apiUrl}/s/:path*` }];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
