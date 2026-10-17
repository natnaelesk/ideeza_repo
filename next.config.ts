import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/points", destination: "/", permanent: false },
      { source: "/history", destination: "/", permanent: false },
      { source: "/internship", destination: "/", permanent: false },
      { source: "/join/:path*", destination: "/", permanent: false },
      { source: "/r/:code", destination: "/profile", permanent: false },
    ];
  },
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
