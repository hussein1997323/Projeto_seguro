/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://husseindev.com.br/api/:path*",
      },
    ];
  },

  images: {
    domains: ["yt3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
