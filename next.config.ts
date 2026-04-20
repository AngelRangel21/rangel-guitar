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
      },
      {
        source: '/songs/te-metiste-ariel-camacho',
        destination: '/es/cancion/te-metiste', // Ajusta al slug real que tengas ahora
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
