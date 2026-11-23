'use client'

import { Guitar, Mic2, Music2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type JSX, useMemo } from 'react'
import { SongList } from '@/components/song-list'
import { useRouter } from '@/i18n/navigation'
import type { SongWithArtist } from '@/types/app.types'
import { SongSearch } from './searching/search'

/** Seis líneas decorativas que evocan las cuerdas de una guitarra. */
const STRINGS = [1, 2, 3, 4, 5, 6] as const

export function HomeClient({
  initialSongs
}: {
  initialSongs: SongWithArtist[]
}): JSX.Element {
  const t = useTranslations('homeClient')
  const router = useRouter()

  const artistCount = useMemo(() => {
    const ids = new Set<string>()
    for (const song of initialSongs) {
      for (const artist of song.artists) ids.add(artist.id)
    }
    return ids.size
  }, [initialSongs])

  return (
    <main className='grow container mx-auto px-4 py-6 md:py-10 space-y-12'>
      {/* ── Hero + buscador ── */}
      <section
        aria-labelledby='home-heading'
        className='relative z-20 rounded-3xl border bg-linear-to-b from-muted/60 to-background px-4 py-12 sm:px-8 md:py-16 animate-fade-up'
      >
        {/* Cuerdas decorativas, recortadas en su propio contenedor para no
            recortar el dropdown del buscador. */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 overflow-hidden rounded-3xl'
        >
          <div className='absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col gap-5 md:gap-7 opacity-60 mask-[linear-gradient(to_right,black,transparent_35%,transparent_65%,black)]'>
            {STRINGS.map((n) => (
              <span
                key={n}
                className='block w-full bg-border'
                style={{ height: `${n * 0.5}px` }}
              />
            ))}
          </div>
        </div>

        <div className='relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center'>
          <p className='inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm'>
            <Guitar aria-hidden='true' className='size-3.5' />
            {t('eyebrow')}
          </p>

          <div className='space-y-3'>
            <h1
              id='home-heading'
              className='text-4xl font-bold tracking-tight text-balance text-foreground md:text-5xl lg:text-6xl font-headline'
            >
              {t('heroTitle')}
            </h1>
            <p className='mx-auto max-w-xl text-base text-pretty text-muted-foreground md:text-lg'>
              {t('discoverAndLearn')}
            </p>
          </div>

          <search className='w-full max-w-xl'>
            <SongSearch
              size='lg'
              enableShortcut
              placeholder={t('search.placeholder')}
              onSubmit={(q) =>
                router.push({ pathname: '/search', query: { q } })
              }
            />
          </search>

          <ul className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground'>
            <li className='inline-flex items-center gap-1.5'>
              <Music2 aria-hidden='true' className='size-4' />
              <span>{t('stats.songs', { count: initialSongs.length })}</span>
            </li>
            <li className='inline-flex items-center gap-1.5'>
              <Mic2 aria-hidden='true' className='size-4' />
              <span>{t('stats.artists', { count: artistCount })}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Lista de canciones ── */}
      <section
        aria-labelledby='songs-heading'
        className='relative z-0 space-y-4 animate-fade-up'
        style={{ animationDelay: '100ms' }}
      >
        <header className='space-y-1'>
          <h2
            id='songs-heading'
            className='text-2xl font-bold tracking-tight text-foreground md:text-3xl font-headline'
          >
            {t('allSongs')}
          </h2>
          <p className='text-sm text-muted-foreground'>{t('allSongsHint')}</p>
        </header>

        <SongList songs={initialSongs} />
      </section>
    </main>
  )
}
