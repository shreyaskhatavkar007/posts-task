import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  redirects: async () => [
    {
      source: "/",
      destination: "/dashboard",
      permanent: false,
    },
  ],
};

export default nextConfig;
