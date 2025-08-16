import type {NextConfig} from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

// Inicializa el plugin de Next.js para Progressive Web Apps (PWA).
const withPWA = withPWAInit({
  dest: 'public', // Directorio donde se guardarán los archivos de la PWA.
  register: true, // Registra el service worker automáticamente.
  disable: process.env.NODE_ENV === 'development', // Desactiva la PWA en desarrollo.
  workboxOptions: {
    skipWaiting: true, // Fuerza al service worker a activarse inmediatamente.
    clientsClaim: true,
  }
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
