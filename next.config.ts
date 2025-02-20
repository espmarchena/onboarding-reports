import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // Avatares de usuarios
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com", // Archivos de repositorios
      },
      {
        protocol: "https",
        hostname: "user-images.githubusercontent.com", // Imágenes subidas en issues/PRs
      },
      {
        protocol: "https",
        hostname: "github.com", // aqui estaran las de los draft https://github.com/user-attachments/assets
      },
    ],
  },
};

export default nextConfig;
