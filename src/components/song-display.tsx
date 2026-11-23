'use client'

import {
  AArrowDown,
  AArrowUp,
  Guitar,
  Pencil,
  Text,
  Trash2
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Fragment, type JSX, useMemo, useState } from 'react'
import { SegmentedControl } from '@/components/layout/segmented-control'
import { SongCard } from '@/components/song-card'
import { SongComments } from '@/components/song-comments'
import { SongRating } from '@/components/song-rating'
import { useI18n } from '@/context/i18n-context'
import { useAuth } from '@/hooks/useAuth'
import { Link } from '@/i18n/navigation'
import { MAX_TRANSPOSE, parseChordSheet, transposeSong } from '@/lib/chordpro'
import type { SongWithArtist } from '@/types/app.types'
import { DeleteSongDialog } from './delete-song-dialog'
import { FavoriteButton } from './favorite-button'
import { SongViewer } from './song-chords'
import { SongLyrics } from './song-lyrics'
import { SongShare } from './song-share'
import { TransposeControls } from './transpose-controls'
import { Video } from './video'

/** Tamaños de letra disponibles para la cifra. */
const FONT_SIZES = [
  'text-xs',
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl'
] as const
const DEFAULT_FONT_SIZE = 1

type SheetMode = 'chords' | 'lyrics'

const cardClass = 'rounded-2xl border bg-card p-4 sm:p-5'

const iconButtonClass =
  'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40'

export function SongDisplay({
  song,
  suggestedSongs
}: {
  song: SongWithArtist
  suggestedSongs: SongWithArtist[]
}): JSX.Element {
  const { t } = useI18n()
  const ts = useTranslations('songView')
  const { isAdmin } = useAuth()

  const [transpose, setTranspose] = useState(0)
  const [mode, setMode] = useState<SheetMode>('chords')
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE)

  const artistsName =
    song.artists.map((a) => a.name).join(', ') || 'Artista desconocido'
  const songTitle = song.title ?? 'Sin titulo'
  const songSlug = song.slug ?? 'Sin slug'
  const songVideo = song.video ?? ''
  const songChords = song.chords ?? ''

  // La cifra se parsea una vez; la transposición la hace @chordproject/parser.
  const parsedSong = useMemo(
    () => parseChordSheet(songChords, song.key),
    [songChords, song.key]
  )
  const transposedSong = useMemo(
    () => transposeSong(parsedSong, transpose),
    [parsedSong, transpose]
  )
  // Solo mostramos tonalidad si es explícita (BD o {key:}), no la inferida.
  const originalKey = parsedSong.key?.toString() ?? null
  const currentKey = originalKey
    ? (transposedSong.key?.toString() ?? originalKey)
    : null

  const uniqueSuggestedSongs = suggestedSongs.filter(
    (suggestedSong, index, self) =>
      index === self.findIndex((s) => s.id === suggestedSong.id)
  )

  const fontClass = FONT_SIZES[fontSize]

  return (
    <div className='space-y-12'>
      {/* ── Cabecera ── */}
      <header className='animate-fade-up rounded-3xl border bg-linear-to-b from-muted/60 to-background px-5 py-7 sm:px-8 md:py-10'>
        <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
          <div className='min-w-0 space-y-3'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground'>
                <Guitar aria-hidden='true' className='size-3.5' />
                {ts('eyebrow')}
              </span>
              {currentKey != null && (
                <span className='rounded-full border bg-background/80 px-3 py-1 text-xs font-semibold tabular-nums text-foreground'>
                  {ts('key', { key: currentKey })}
                </span>
              )}
            </div>
            <h1 className='text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl font-headline'>
              {songTitle}
            </h1>
            <p className='text-lg text-muted-foreground'>
              {song.artists.length === 0
                ? artistsName
                : song.artists.map((artist, index) => (
                    <Fragment key={artist.id}>
                      {index > 0 && ', '}
                      <Link
                        href={{
                          pathname: '/artists/[slug]',
                          params: { slug: artist.slug }
                        }}
                        className='font-medium text-foreground underline-offset-4 hover:underline'
                      >
                        {artist.name}
                      </Link>
                    </Fragment>
                  ))}
            </p>
          </div>

          <div className='flex shrink-0 flex-wrap items-center gap-2'>
            <FavoriteButton song={song} />
            {isAdmin && (
              <>
                <Link
                  href={{
                    pathname: '/songs/[slug]/edit',
                    params: { slug: songSlug }
                  }}
                  className='inline-flex h-9 items-center gap-1.5 rounded-full border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted'
                >
                  <Pencil aria-hidden='true' className='size-4' />
                  {t('edit')}
                </Link>
                <DeleteSongDialog song={song}>
                  <button
                    type='button'
                    className='inline-flex h-9 items-center gap-1.5 rounded-full bg-destructive/10 px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20'
                  >
                    <Trash2 aria-hidden='true' className='size-4' />
                    {t('delete')}
                  </button>
                </DeleteSongDialog>
              </>
            )}
          </div>
        </div>
      </header>
      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8'>
        {/* ── Panel lateral: video, tono, compartir y valoración ── */}
        <aside className='space-y-4 lg:sticky lg:top-24 lg:order-last lg:self-start'>
          {songVideo !== '' && (
            <div className='overflow-hidden rounded-2xl border bg-muted'>
              <Video
                videoId={songVideo}
                title={`Video de la canción ${songTitle} del artista ${artistsName}`}
              />
            </div>
          )}

          <div className={cardClass}>
            <TransposeControls
              transposeAmount={transpose}
              originalKey={originalKey}
              currentKey={currentKey}
              onUp={() => setTranspose((v) => Math.min(v + 1, MAX_TRANSPOSE))}
              onDown={() =>
                setTranspose((v) => Math.max(v - 1, -MAX_TRANSPOSE))
              }
              onReset={() => setTranspose(0)}
            />
          </div>

          <div className={`${cardClass} space-y-3`}>
            <h3 className='text-sm font-semibold text-foreground'>
              {t('share')}
            </h3>
            <SongShare title={songTitle} artist={artistsName} />
          </div>

          <SongRating songId={song.id} />
        </aside>

        {/* ── Cifra ── */}
        <section
          aria-label={t('chordsAndLyrics')}
          className='min-w-0 overflow-hidden rounded-2xl border bg-card'
        >
          <div className='flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-3 py-2 sm:px-4'>
            <SegmentedControl<SheetMode>
              label={ts('viewMode')}
              value={mode}
              onChange={setMode}
              options={[
                {
                  value: 'chords',
                  label: t('chordsAndLyrics'),
                  icon: <Guitar />
                },
                { value: 'lyrics', label: t('lyricsOnly'), icon: <Text /> }
              ]}
            />

            <fieldset className='inline-flex items-center gap-0.5 rounded-lg border bg-muted/50 p-0.5'>
              <legend className='sr-only'>{ts('fontSize')}</legend>
              <button
                type='button'
                onClick={() => setFontSize((v) => Math.max(v - 1, 0))}
                disabled={fontSize === 0}
                aria-label={ts('smaller')}
                title={ts('smaller')}
                className={iconButtonClass}
              >
                <AArrowDown aria-hidden='true' className='size-4' />
              </button>
              <button
                type='button'
                onClick={() =>
                  setFontSize((v) => Math.min(v + 1, FONT_SIZES.length - 1))
                }
                disabled={fontSize === FONT_SIZES.length - 1}
                aria-label={ts('larger')}
                title={ts('larger')}
                className={iconButtonClass}
              >
                <AArrowUp aria-hidden='true' className='size-4' />
              </button>
            </fieldset>
          </div>

          <div className='overflow-x-auto p-4 sm:p-6'>
            {mode === 'chords' ? (
              <SongViewer song={transposedSong} className={fontClass} />
            ) : (
              <div className='whitespace-pre-wrap leading-relaxed'>
                <SongLyrics chordSheet={songChords} className={fontClass} />
              </div>
            )}
          </div>
        </section>
      </div>
      {/* ── Sugerencias ── */}
      {uniqueSuggestedSongs.length > 0 && (
        <section aria-labelledby='suggested-songs' className='space-y-5'>
          <h2
            id='suggested-songs'
            className='text-2xl font-bold tracking-tight text-foreground md:text-3xl font-headline'
          >
            {t('suggestedSongs')}
          </h2>
          <ul className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3'>
            {uniqueSuggestedSongs.map((s) => (
              <li key={s.id}>
                <SongCard song={s} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {/* ── Comentarios ── */}
      <SongComments songId={song.id} />
    </div>
  )
}
