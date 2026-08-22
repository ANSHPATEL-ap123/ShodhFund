import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.e2b.app"],
  serverExternalPackages: ["pdfkit", "jsonwebtoken"],
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;