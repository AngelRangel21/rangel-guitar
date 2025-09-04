import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { I18nProvider } from '@/context/i18n-context';
import { ThemeProvider } from '@/context/theme-provider';
import Script from 'next/script';

// Configuración de la fuente 'Inter' de Google Fonts.
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter', // Asigna la fuente a una variable CSS para usarla en Tailwind.
});

/**
 * Metadatos globales para toda la aplicación.
 * Define el título por defecto, descripción, imágenes para redes sociales (Open Graph),
 * configuración para PWA y otros detalles importantes para SEO y la experiencia del usuario.
 */
export const metadata: Metadata = {
  title: {
    default: 'Rangel Guitar - Tablaturas y Acordes para Guitarra',
    template: '%s | Rangel Guitar', // Plantilla para los títulos de páginas individuales.
  },
  description: 'Tu destino para encontrar tablaturas, letras y acordes de guitarra para tus canciones favoritas. Aprende a tocar con nuestra gran colección de música.',
  metadataBase: new URL('https://rangelguitar.com'),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rangel Guitar',
  },
  manifest: "/manifest.json",
  openGraph: {
    title: 'Rangel Guitar - Tablaturas y Acordes para Guitarra',
    description: 'Tu destino para encontrar tablaturas, letras y acordes de guitarra para tus canciones favoritas.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Rangel Guitar',
    images: [
      {
        url: "./og-image.jpg",
        width: 1200,
        height: 630,
        alt: 'Rangel Guitar, tu sitio de tablaturas, acordes y canciones.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rangel Guitar',
    description: 'Tu destino para tablaturas, acordes y canciones de guitarra.',
    images: ["/og-image.jpg"],
  },
};

/**
 * Configuración del viewport para la aplicación.
 * Define el color del tema para la barra de estado del navegador en modos claro y oscuro.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#eef0f3' },
    { media: '(prefers-color-scheme: dark)', color: '#1d232a' },
  ],
}

/**
 * Layout raíz de la aplicación.
 * Envuelve a todas las páginas y provee los contextos globales como autenticación,
 * internacionalización (i18n) y tema (claro/oscuro).
 * @param {{ children: React.ReactNode }} props - Los componentes hijos que serán renderizados dentro del layout.
 * @returns {JSX.Element} El layout raíz.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning se usa para evitar advertencias con next-themes.
    <html lang="es" className={`${inter.variable} !scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1028178529084620"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4XM34YVJLK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4XM34YVJLK');
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        {/* Proveedor de tema para manejar el modo claro/oscuro. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Proveedor de internacionalización para manejar los idiomas. */}
          <I18nProvider>
            {/* Proveedor de autenticación para gestionar el estado del usuario. */}
            <AuthProvider>
              {children}
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
        {/* Componente para mostrar notificaciones (toasts). */}
        <Toaster />
      </body>
    </html>
  );
}
