import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer", "exceljs"],
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
