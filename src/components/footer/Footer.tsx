'use client'

import { Music } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ComponentProps, JSX } from 'react'
import { FacebookIcon, TelegramIcon, WhatsAppIcon } from '@/components/icons'
import { Link } from '@/i18n/navigation'
import { PayPal } from './components/PayPal'

type Href = ComponentProps<typeof Link>['href']

interface FooterLink {
  href: Href
  label: string
  title: string
}

const linkClass =
  'text-sm text-muted-foreground transition-colors hover:text-foreground'

export function Footer(): JSX.Element {
  const t = useTranslations('footer')
  const th = useTranslations('header')
  const currentYear = new Date().getFullYear()

  const explore: FooterLink[] = [
    { href: '/', label: th('home.label'), title: th('home.title') },
    {
      href: '/artists',
      label: th('artists.label'),
      title: th('artists.title')
    },
    { href: '/learn', label: th('learn.label'), title: th('learn.title') },
    {
      href: '/request-song',
      label: th('request.label'),
      title: th('request.title')
    }
  ]

  const legal: FooterLink[] = [
    {
      href: '/privacy-policy',
      label: t('politics.privacy.label'),
      title: t('politics.privacy.title')
    },
    {
      href: '/security',
      label: t('politics.security.label'),
      title: t('politics.security.title')
    },
    {
      href: '/cookie-policy',
      label: t('politics.cookies.label'),
      title: t('politics.cookies.title')
    }
  ]

  const social = [
    {
      href: 'https://www.facebook.com/share/1Akd7FErLL/?mibextid=wwXlfr',
      label: 'Facebook',
      title: t('social.facebook.title'),
      icon: <FacebookIcon className='size-5' />
    },
    {
      href: 'https://chat.whatsapp.com/Hbtr0lzFG4u4AGvAStj6WJ?mode=r_c',
      label: 'WhatsApp',
      title: t('social.whatsapp.title'),
      icon: <WhatsAppIcon className='size-5' />
    },
    {
      href: 'https://t.me/Rangelguitar',
      label: 'Telegram',
      title: t('social.telegram.title'),
      icon: <TelegramIcon className='size-5' />
    }
  ]

  return (
    <footer className='mt-12 border-t bg-muted/30'>
      <div className='container mx-auto space-y-12 px-4 py-12'>
        {/* Donaciones */}
        <section className='flex flex-col items-start gap-6 rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-1.5'>
            <h2 className='text-xl font-bold tracking-tight font-headline sm:text-2xl'>
              {t('youLiked')}
            </h2>
            <p className='max-w-lg text-primary-foreground/75'>{t('free')}</p>
          </div>
          <PayPal />
        </section>

        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]'>
          <div className='space-y-3'>
            <Link href='/' className='inline-flex items-center gap-2.5'>
              <span className='flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground'>
                <Music aria-hidden='true' className='size-5' />
              </span>
              <span className='text-lg font-bold tracking-tight font-headline'>
                Rangel Guitar
              </span>
            </Link>
            <p className='max-w-xs text-sm text-muted-foreground'>
              {t('tagline')}
            </p>
          </div>

          <nav aria-label={t('explore')} className='space-y-3'>
            <h3 className='text-sm font-semibold text-foreground'>
              {t('explore')}
            </h3>
            <ul className='space-y-2'>
              {explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    title={link.title}
                    className={linkClass}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('legal')} className='space-y-3'>
            <h3 className='text-sm font-semibold text-foreground'>
              {t('legal')}
            </h3>
            <ul className='space-y-2'>
              {legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    title={link.title}
                    className={linkClass}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className='space-y-3'>
            <h3 className='text-sm font-semibold text-foreground'>
              {t('social.social')}
            </h3>
            <ul className='flex gap-2'>
              {social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={item.label}
                    title={item.title}
                    className='inline-flex size-10 items-center justify-center rounded-full border bg-background transition-colors hover:bg-muted'
                  >
                    {item.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className='border-t pt-6 text-sm text-muted-foreground'>
          {t('copyright', { year: `${currentYear}` })}
        </p>
      </div>
    </footer>
  )
}
