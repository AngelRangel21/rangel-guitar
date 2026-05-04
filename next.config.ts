import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // php
      {
        source: '/:path.php',
        destination: '/',
        permanent: true
      },
      {
        source: '/songs/afs-natanael-cano',
        destination: '/es/cancion/afs',
        permanent: true
      },
      {
        source: '/songs/te-metiste-ariel-camacho',
        destination: '/es/cancion/te-metiste',
        permanent: true
      },
      {
        source: '/songs/el-nayer-natanael-cano',
        destination: '/es/cancion/el-nayer',
        permanent: true
      },
      {
        source: '/songs/fuego-cruzado-virlan-garcia',
        destination: '/es/cancion/fuego-cruzado',
        permanent: true
      },
      {
        source: '/songs/antes-y-despus-de-ti-t3r-elemento',
        destination: '/es/cancion/antes-y-despues-de-ti',
        permanent: true
      },
      {
        source: '/songs/el-karma-ariel-camacho',
        destination: '/es/cancion/el-karma',
        permanent: true
      },
      {
        source: '/songs/voy-a-amarte-hoy-virlan-garcia',
        destination: '/es/cancion/voy-a-amarte-hoy',
        permanent: true
      },
      {
        source: '/songs/la-revancha-t3r-elemento',
        destination: '/es/cancion/la-revancha',
        permanent: true
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/**'
      }
    ]
  }
}
const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
