/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    domains: ["yt3.googleusercontent.com"], // Adicione aqui os domínios permitidos
  },
};

module.exports = nextConfig;
