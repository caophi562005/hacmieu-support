/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.vietqr.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/conversations",
        permanent: true, // true (308) for permanent redirect, false (307) for temporary
      },
    ];
  },
};

export default nextConfig;
