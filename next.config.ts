import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin-shwecharity-devv.s3.ap-southeast-1.amazonaws.com"
      },
      {
        protocol: "https",
        hostname: "static-web-series-dev.s3.ap-southeast-1.amazonaws.com"
      }
    ],
    dangerouslyAllowSVG: true // this force svg format to display
  }
};

export default nextConfig;
