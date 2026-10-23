import type { NextConfig } from "next";
import mapRedirects from "./app/lib/map-redirects.json";

const nextConfig: NextConfig = {
  async redirects() {
    return mapRedirects;
  },
};

export default nextConfig;
