import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const isDev = process.env.NODE_ENV === 'development'

// Origen de Supabase configurado (en E2E apunta al mock local). Se añade a
// `connect-src` para que el navegador pueda hablar con él sin bloquearlo por CSP.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseOrigin = (() => {
  if (supabaseUrl == null || supabaseUrl.length === 0) return null
  try {
    return new URL(supabaseUrl).origin
  } catch {
    return null
  }
})()
const supabaseWsOrigin = supabaseOrigin?.replace(/^http/, 'ws') ?? null
const canUpgradeInsecureRequests =
  !isDev &&
  supabaseOrigin != null &&
  !/^http:\/\/(localhost|127\.0\.0\.1|\[::1\])/.test(supabaseOrigin)

const csp = `
default-src 'self';
base-uri 'self';
object-src 'none';
frame-ancestors 'none';

script-src
'self'
'unsafe-inline'
${isDev ? " 'unsafe-eval'" : ''}
https://www.googletagmanager.com
https://va.vercel-scripts.com
https://vercel.live
https://www.youtube.com;

style-src
'self'
'unsafe-inline'
https://fonts.googleapis.com
https://vercel.live
https://*.vercel.live;

font-src
'self'
https://fonts.gstatic.com
https://vercel.live
https://*.vercel.live;

img-src
'self'
data:
blob:
https:
https://img.youtube.com
https://i.ytimg.com
https://*.supabase.co
https://vercel.live
https://*.vercel.live
${supabaseOrigin ?? ''};

connect-src
'self'
https://*.supabase.co
wss://*.supabase.co
https://vitals.vercel-insights.com
https://analitycs.google.com
https://www.google.com
https://*.google.analitycs.com
https://*.analitycs.google.com
https://*.googletagmanager.com
https://vercel.live
https://*.vercel.live
${supabaseOrigin ?? ''}
${supabaseWsOrigin ?? ''};

frame-src
https://www.youtube.com
https://www.youtube-nocookie.com
https://vercel.live
https://*.vercel.live;

media-src 'self';

${canUpgradeInsecureRequests ? 'upgrade-insecure-requests;' : ''}
`
  .replace(/\n/g, ' ')
  .replace(/\s{2,}/g, ' ')
  .trim()

const nextConfig: NextConfig = {
  output: 'standalone',
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
      },
      {
        source: '/es/cancion/botella-tras-botellas',
        destination: '/es/cancion/botella-tras-botella',
        permanent: true
      },
      {
        source: '/en/songs/botella-tras-botellas',
        destination: '/en/songs/botella-tras-botella',
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
            key: 'Content-Security-Policy',
            value: csp
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), fullscreen=(self)'
          }
        ]
      }
    ]
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
