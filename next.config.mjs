/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mfapi.in',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Faster builds
  },
  async rewrites() {
    return [
      {
        source: '/api/mf/:path*',
        destination: `https://mutual-fund-q5qt.onrender.com/api/mf/:path*`,
      },
      {
        source: '/api/funds',
        destination: `https://mutual-fund-q5qt.onrender.com/api/funds`,
      },
      {
        source: '/api/funds/:path*',
        destination: `https://mutual-fund-q5qt.onrender.com/api/funds/:path*`,
      },
      {
        source: '/api/scheme/:path*',
        destination: `https://mutual-fund-q5qt.onrender.com/api/scheme/:path*`,
      },
      {
        source: '/api/market/:path*',
        destination: `https://mutual-fund-q5qt.onrender.com/api/market/:path*`,
      },
      {
        source: '/api/cron/:path*',
        destination: `https://mutual-fund-q5qt.onrender.com/api/cron/:path*`,
      },
    ]
  },
  // Optimize for Vercel
  poweredByHeader: false,
  compress: true,
  env: {
    BACKEND_URL: 'https://mutual-fund-q5qt.onrender.com',
  },
  swcMinify: true,
}

export default nextConfig