import type {NextConfig} from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

// Inicializa el plugin de Next.js para Progressive Web Apps (PWA).
const withPWA = withPWAInit({
  dest: 'public', // Directorio donde se guardarán los archivos de la PWA.
  disable: process.env.NODE_ENV === 'development', // Desactiva la PWA en desarrollo.
  register: true, // Registra el service worker automáticamente.
  skipWaiting: true, // Fuerza al service worker a activarse inmediatamente.
});

/**
 * Configuración principal de Next.js para la aplicación.
 * @type {NextConfig}
 */
const nextConfig: NextConfig = {
  /* Opciones de configuración aquí */
  output: 'standalone', // Optimiza la salida para despliegues en contenedores como Docker.
  typescript: {
    // Ignora errores de TypeScript durante la compilación. Útil para acelerar el desarrollo,
    // pero se recomienda verificar los tipos por separado.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora errores de ESLint durante la compilación.
    ignoreDuringBuilds: true,
  },
  images: {
    // Configura los dominios remotos desde los que se pueden cargar imágenes.
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

// Envuelve la configuración de Next.js con la configuración de PWA.
export default withPWA(nextConfig);
