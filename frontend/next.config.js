/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // ESLint configuration is managed by eslint.config.mjs (flat config)
    // Disable Next.js's automatic ESLint integration
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig