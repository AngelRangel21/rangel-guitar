import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { I18nProvider } from '@/context/i18n-context';
import { ThemeProvider } from '@/context/theme-provider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Rangel Guitar - Tablaturas y Acordes para Guitarra',
    template: '%s | Rangel Guitar',
  },
  description: 'Tu destino para encontrar tablaturas, letras y acordes de guitarra para tus canciones favoritas. Aprende a tocar con nuestra gran colección de música.',
  metadataBase: new URL('https://rangelguitar.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rangel Guitar',
  },
  openGraph: {
    title: 'Rangel Guitar - Tablaturas y Acordes para Guitarra',
    description: 'Tu destino para encontrar tablaturas, letras y acordes de guitarra para tus canciones favoritas.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Rangel Guitar',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Rangel Guitar, tu sitio de tablaturas y acordes.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rangel Guitar',
    description: 'Tu destino para tablaturas y canciones de guitarra.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#eef0f3' },
    { media: '(prefers-color-scheme: dark)', color: '#1d232a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} !scroll-smooth`} suppressHydrationWarning>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
