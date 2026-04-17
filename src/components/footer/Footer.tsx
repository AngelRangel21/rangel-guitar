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
      icon: <FacebookIcon className='h-6 w-6' />
    },
    {
      href: 'https://chat.whatsapp.com/Hbtr0lzFG4u4AGvAStj6WJ?mode=r_c',
      label: 'WhatsApp',
      title: t('social.whatsapp.title'),
      icon: <WhatsAppIcon className='h-6 w-6' />
    },
    {
      href: 'https://t.me/Rangelguitar',
      label: 'Telegram',
      title: t('social.telegram.title'),
      icon: <TelegramIcon className='h-6 w-6' />
    }
  ]

  return (
    <footer className='bg-slate-900 text-slate-400 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left mb-10 border-b border-slate-800 pb-10'>
          <div>
            <h4 className='text-white font-bold mb-4'>{t('youLiked')}</h4>
            <p className='text-sm mb-6'>{t('free')}</p>
          </div>
          <PayPal />
          <div className='flex flex-col justify-center md:justify-end'>
            <p className='text-center md:text-end mb-2'>{t('social.social')}</p>
            <nav className='flex justify-center md:justify-end gap-4'>
              {social.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  aria-label={social.label}
                  title={social.title}
                  className='p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-slate-900 transition-all'
                >
                  {social.icon}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className='flex flex-col md:flex-row justify-between items-center text-xs gap-4'>
          <div className='flex gap-8'>
            <Link
              className='hover:text-white transition-colors'
              href='/privacy-policy'
              title={t('politics.privacy.title')}
            >
              {t('politics.privacy.label')}
            </Link>
            <Link
              className='hover:text-white transition-colors'
              href='/security'
              title={t('politics.security.title')}
            >
              {t('politics.security.label')}
            </Link>
            <Link
              className='hover:text-white transition-colors'
              href='/cookie-policy'
              title={t('politics.cookies.title')}
            >
              {t('politics.cookies.label')}
            </Link>
          </div>
          <p>{t('copyright', { year: `${currentYear}` })}</p>
        </div>
      </div>
    </footer>
  )
}
