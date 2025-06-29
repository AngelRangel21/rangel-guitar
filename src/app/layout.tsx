import type {Metadata} from 'next';
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
  metadataBase: new URL('https://rangel-guitar.firebaseapp.com'),
  openGraph: {
    title: 'Rangel Guitar - Tablaturas y Acordes para Guitarra',
    description: 'Tu destino para encontrar tablaturas, letras y acordes de guitarra para tus canciones favoritas.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Rangel Guitar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rangel Guitar',
    description: 'Tu destino para tablaturas y canciones de guitarra.',
  },
};

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
