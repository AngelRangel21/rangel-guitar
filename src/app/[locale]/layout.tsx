import clsx from 'clsx'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import {
  getMessages,
  getTranslations,
  setRequestLocale
} from 'next-intl/server'
import type { JSX } from 'react'
import { AuthProvider } from '@/auth/provider/auth.provider'
import { Footer } from '@/components/footer/Footer'
import { Header } from '@/components/header/Header'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/context/theme-provider'
import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'page.Metadata' })

  const pathname = getPathname({
    locale: locale,
    href: {
      pathname: '/'
    }
  })

  const languages = Object.fromEntries(
    routing.locales.map((lang) => [
      lang,
      `https://rangelguitar.com${getPathname({
        locale: lang,
        href: { pathname: '/' }
      })}`
    ])
  )

  return {
    title: {
      default: t('title'),
      template: '%s | Rangel Guitar'
    },
    description: t('description'),
    metadataBase: new URL('https://rangelguitar.com'),
    applicationName: 'Rangel Guitar',
    authors: [{ name: 'Rangel Guitar Team', url: 'https://rangelguitar.com' }],
    // Las keywords se pueden traducir si quieres, pero muchas son universales
    keywords: ['guitarra', 'acordes', 'tabs', 'chords', 'regional mexicano'],
    alternates: {
      canonical: `https://rangelguitar.com${pathname}`,
      languages: languages
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://rangelguitar.com${pathname}`,
      siteName: 'Rangel Guitar',
      // locale: locale === 'es' ? 'es_MX' : 'en_US', // Ajusta según tu público
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: t('ogImageAlt')
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Rangel Guitar',
      description: t('description'),
      images: ['/og-image.jpg']
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    verification: {
      google: 'google-site-verification-code'
    }
  }
}

export default async function RootLayout({
  children,
  params
}: LayoutProps<'/[locale]'>): Promise<JSX.Element> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={clsx(inter.className)}
      suppressHydrationWarning
    >
      {/* <!-- Google Tag Manager --> */}
      <Script id='google-tag-manager' strategy='afterInteractive'>
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-MS224ZBH');
      `}
      </Script>
      {/* <!-- End Google Tag Manager --> */}
      <body className='font-body antialiased grid min-h-dvh grid-rows-[auto_1fr_auto]'>
        {/* <!-- Google Tag Manager (noscript) --> */}
        <noscript>
          <iframe
            title='Google Tag Manager'
            src='https://www.googletagmanager.com/ns.?id=GTM-MS224ZBH'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* <!-- End Google Tag Manager (noscript) --> */}
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
              <Header />
              {children}
              <Footer />
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
