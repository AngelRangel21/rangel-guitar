'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { FacebookIcon, TelegramIcon, WhatsAppIcon } from '@/components/icons'
import { PayPal } from './components/PayPal'

export function Footer(): JSX.Element {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  const social = [
    {
      href: 'https://www.facebook.com/share/1Akd7FErLL/?mibextid=wwXlfr',
      label: 'Facebook',
      title: t('social.facebook.title'),
      icon: <FacebookIcon className='h-5 w-5' />
    },
    {
      href: 'https://chat.whatsapp.com/Hbtr0lzFG4u4AGvAStj6WJ?mode=r_c',
      label: 'WhatsApp',
      title: t('social.whatsapp.title'),
      icon: <WhatsAppIcon className='h-5 w-5' />
    },
    {
      href: 'https://t.me/Rangelguitar',
      label: 'Telegram',
      title: t('social.telegram.title'),
      icon: <TelegramIcon className='h-5 w-5' />
    }
  ]

  return (
    <footer className='bg-primary text-secondary-foreground py-16 border-t border-border'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left mb-12 border-b border-border pb-12'>
          <div>
            <h3 className='text-xl font-bold mb-4 font-headline tracking-tight'>
              {t('youLiked')}
            </h3>
            <p className='text-secondary-foreground/70 mb-6'>{t('free')}</p>
          </div>
          <PayPal />
          <div className='flex flex-col justify-center md:justify-end'>
            <p className='text-center md:text-end mb-4 text-secondary-foreground/70'>
              {t('social.social')}
            </p>
            <nav className='flex justify-center md:justify-end gap-3'>
              {social.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  aria-label={social.label}
                  title={social.title}
                  className='p-2.5 bg-muted rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-110'
                >
                  {social.icon}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className='flex flex-col md:flex-row justify-between items-center text-sm gap-4 text-muted-foreground'>
          <div className='flex flex-wrap justify-center gap-6'>
            <Link
              className='hover:text-accent transition-colors duration-200'
              href='/privacy-policy'
              title={t('politics.privacy.title')}
            >
              {t('politics.privacy.label')}
            </Link>
            <Link
              className='hover:text-accent transition-colors duration-200'
              href='/security'
              title={t('politics.security.title')}
            >
              {t('politics.security.label')}
            </Link>
            <Link
              className='hover:text-accent transition-colors duration-200'
              href='/cookie-policy'
              title={t('politics.cookies.title')}
            >
              {t('politics.cookies.label')}
            </Link>
          </div>
          <p className='text-muted-foreground/50'>
            {t('copyright', { year: `${currentYear}` })}
          </p>
        </div>
      </div>
    </footer>
  )
}
