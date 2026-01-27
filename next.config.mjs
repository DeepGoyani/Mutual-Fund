/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: true,
  },
  images: {
    domains: ['api.mfapi.in'],
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      {
        source: '/api/mf/:path*',
        destination: 'https://api.mfapi.in/:path*',
      },
    ]
  },
}

export default nextConfig