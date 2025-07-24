/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 👈 Adiciona essa linha para permitir exportação estática
  trailingSlash: true, // 👈 Adiciona isso para garantir que os links funcionem corretamente em hospedagens simples

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
