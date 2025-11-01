/** @type {import('next').NextConfig} */
const nextConfig = {
  // Elimina reactStrictMode - ya está incluido por defecto
  images: {
    domains: ['i.postimg.cc'],
    // ELIMINA unoptimized: true - deja que Vercel optimice las imágenes
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // AGREGA esta configuración para Vercel
  output: 'standalone', // o 'export' si tu app es completamente estática
  trailingSlash: false,
}

module.exports = nextConfig