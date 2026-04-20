import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/songs/afs-natanael-cano',
        destination: '/es/cancion/afs',
        permanent: true
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
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
