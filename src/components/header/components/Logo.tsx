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
      className='flex items-center gap-2'
      aria-label={t('ariaLabel')}
      title={t('title')}
    >
      <Music className='h-8 w-8 text-accent' />
      <h1 className='text-2xl font-bold whitespace-nowrap'>{t('appName')}</h1>
    </Link>
  )
}
