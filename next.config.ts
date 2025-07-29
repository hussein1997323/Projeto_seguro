/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 👈 Adiciona essa linha para permitir exportação estática
  trailingSlash: true, // 👈 Adiciona isso para garantir que os links funcionem corretamente em hospedagens simples

  images: {
    domains: ["yt3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
