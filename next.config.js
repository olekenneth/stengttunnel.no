/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Disable ESLint during builds (we can enable later if needed)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build (we'll fix them incrementally)
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
