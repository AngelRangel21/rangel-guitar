import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { I18nProvider } from "@/context/i18n-context";
import { ThemeProvider } from "@/context/theme-provider";
import Script from "next/script";

// Configuración de la fuente 'Inter' de Google Fonts.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Asigna la fuente a una variable CSS para usarla en Tailwind.
});

/**
 * Metadatos globales para toda la aplicación.
 * Define el título por defecto, descripción, imágenes para redes sociales (Open Graph),
 * configuración para PWA y otros detalles importantes para SEO y la experiencia del usuario.
 */
export const metadata: Metadata = {
  title: {
    default: "Rangel Guitar - Tablaturas y Acordes para Guitarra",
    template: "%s | Rangel Guitar",
  },
  description:
    "Tu destino para encontrar tablaturas, letras y acordes de guitarra para tus canciones favoritas. Aprende a tocar con nuestra gran colección de música.",
  metadataBase: new URL("https://rangelguitar.com"),
  applicationName: "Rangel Guitar",
  authors: [{ name: "Rangel Guitar Team", url: "https://rangelguitar.com" }],
  generator: "Next.js",
  keywords: [
    "guitarra",
    "tablaturas",
    "acordes",
    "letras",
    "canciones",
    "aprender guitarra",
    "música",
    "tabs",
    "chords",
    "lyrics",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Rangel Guitar",
  publisher: "Rangel Guitar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/es-ES",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rangel Guitar",
  },
  // manifest: "/manifest.json", // Se usará manifest.ts
  openGraph: {
    title: "Rangel Guitar - Tablaturas y Acordes para Guitarra",
    description:
      "Tu destino para encontrar tablaturas, letras y acordes de guitarra para tus canciones favoritas.",
    url: "https://rangelguitar.com",
    siteName: "Rangel Guitar",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "./og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rangel Guitar, tu sitio de tablaturas, acordes y canciones.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rangel Guitar",
    description: "Tu destino para tablaturas, acordes y canciones de guitarra.",
    creator: "@rangelguitar", // Placeholder
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code", // Placeholder
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rangel Guitar",
  url: "https://rangelguitar.com",
  logo: "https://rangelguitar.com/icon.png",
  sameAs: [
    "https://facebook.com/rangelguitar", // Placeholder
    "https://twitter.com/rangelguitar", // Placeholder
    "https://instagram.com/rangelguitar", // Placeholder
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-555-555-5555", // Placeholder
    contactType: "customer service",
    areaServed: "ES",
    availableLanguage: "Spanish",
  },
};

/**
 * Configuración del viewport para la aplicación.
 * Define el color del tema para la barra de estado del navegador en modos claro y oscuro.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "hsl(210, 22%, 31%)" },
    { media: "(prefers-color-scheme: dark)", color: "hsl(210, 22%, 11%)" },
  ],
};

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
    <html
      lang="es"
      className={`${inter.variable} scroll-smooth!`}
      suppressHydrationWarning>
      {/* <!-- Google Tag Manager --> */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-MS224ZBH');
      `}
      </Script>
      {/* <!-- End Google Tag Manager --> */}
      <body className="font-body antialiased">
        {/* <!-- Google Tag Manager (noscript) --> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MS224ZBH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}></iframe>
        </noscript>
        {/* <!-- End Google Tag Manager (noscript) --> */}
        {/* Proveedor de tema para manejar el modo claro/oscuro. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {/* Proveedor de internacionalización para manejar los idiomas. */}
          <I18nProvider>
            {/* Proveedor de autenticación para gestionar el estado del usuario. */}
            <AuthProvider>{children}</AuthProvider>
          </I18nProvider>
        </ThemeProvider>
        {/* Componente para mostrar notificaciones (toasts). */}
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
