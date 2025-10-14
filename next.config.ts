import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "vinza-media-bucket.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
