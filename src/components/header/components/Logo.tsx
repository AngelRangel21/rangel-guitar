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
      className='group flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      aria-label={t('ariaLabel')}
      title={t('title')}
    >
      <span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105'>
        <Music aria-hidden='true' className='size-5' />
      </span>
      <span className='truncate text-lg font-bold tracking-tight whitespace-nowrap font-headline sm:text-xl'>
        Rangel Guitar
      </span>
    </Link>
  )
}
