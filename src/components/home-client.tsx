'use client'

import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { SongList } from '@/components/song-list'
import type { SongWithArtist } from '@/types/app.types'
import { SongSearch } from './search'

export function HomeClient({
  initialSongs
}: {
  initialSongs: SongWithArtist[]
}): JSX.Element {
  const t = useTranslations('homeClient')

  return (
    <main className='grow container mx-auto px-4 py-8 space-y-8'>
      <section className='text-center space-y-4 animate-fade-up'>
        <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight font-headline'>
          {t('allSongs')}
        </h2>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          {t('discoverAndLearn')}
        </p>
      </section>

      <div
        className='max-w-xl mx-auto animate-fade-up'
        style={{ animationDelay: '100ms' }}
      >
        <SongSearch placeholder={t('search.placeholder')} />
      </div>

      <div className='animate-fade-up' style={{ animationDelay: '200ms' }}>
        <SongList songs={initialSongs} />
      </div>
    </main>
  )
}
