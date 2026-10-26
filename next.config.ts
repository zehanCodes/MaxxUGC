import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Cache Components (PPR-style static/dynamic splitting) is off: every
  // route in this app is a per-user authenticated dashboard, so there's
  // nothing worth statically caching and it would just add Suspense
  // boilerplate around every cookies()/auth call for no benefit.
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
