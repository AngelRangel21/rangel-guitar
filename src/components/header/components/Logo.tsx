'use client'

import { Music } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { Link } from '@/i18n/navigation'

export function Logo(): JSX.Element {
  const t = useTranslations('logo')

  return (
    <Link
      href='/'
      className='flex items-center gap-2.5 group'
      aria-label={t('ariaLabel')}
      title={t('title')}
    >
      <div className='relative'>
        <Music className='h-8 w-8 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12' />
        <div className='absolute inset-0 bg-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      </div>
      <span className='text-2xl font-bold whitespace-nowrap font-headline tracking-tight'>
        Rangel Guitar
      </span>
    </Link>
  )
}
