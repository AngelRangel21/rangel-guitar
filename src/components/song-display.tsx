'use client'

import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { type JSX, useState } from 'react'
import {
  FacebookIcon,
  TelegramIcon,
  WhatsAppIcon,
  XTwitter
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useI18n } from '@/context/i18n-context'
import { useAuth } from '@/hooks/useAuth'
import type { SongWithArtist } from '@/types/app.types'
import { DeleteSongDialog } from './delete-song-dialog'
import { FavoriteButton } from './favorite-button'
import { SongViewer } from './song-chords'
import { SongListItem } from './song-list-item'
import { SongLyrics } from './song-lyrics'
import { TransposeControls } from './transpose-controls'
import { Video } from './video'

export function SongDisplay({
  song,
  suggestedSongs
}: {
  song: SongWithArtist
  suggestedSongs: SongWithArtist[]
}): JSX.Element {
  const [transpose, setTranspose] = useState<number>(0)
  const { t } = useI18n()
  const { isAdmin } = useAuth()
  const artistsName =
    song.artists.map((a) => a.name).join(', ') ?? 'Artista desconocido'
  const songTitle = song.title ?? 'Sin titulo'
  const songSlug = song.slug ?? 'Sin slug'
  const songVideo = song.video ?? ''
  const songChords = song.chords ?? ''

  const uniqueSuggestedSongs = suggestedSongs.filter(
    (suggestedSong, index, self) =>
      index === self.findIndex((s) => s.id === suggestedSong.id)
  )

  const shareText = t('shareText', { title: songTitle, artist: artistsName })

  return (
    <div className='opacity-0 animate-content-in'>
      <div className='grid lg:grid-cols-3 gap-8'>
        {/* Columna izquierda: Portada, controles y metadatos */}
        <div className='lg:col-span-1'>
          <Card className='overflow-hidden lg:sticky lg:top-24'>
            {songVideo !== null && (
              <div className='w-full aspect-video'>
                <Video
                  videoId={`${songVideo}`}
                  title={`Video de la canción ${songTitle} del artista ${artistsName}`}
                />
              </div>
            )}
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle className='text-2xl'>
                    <h1>{songTitle}</h1>
                  </CardTitle>
                  <CardDescription>
                    <h2>{artistsName}</h2>
                  </CardDescription>
                </div>
                {/* Botón de Favoritos (solo para usuarios autenticados) */}
                <FavoriteButton song={song} />
              </div>
            </CardHeader>
            <CardContent>
              {/* Acciones de Administrador (solo para administradores) */}
              {isAdmin && (
                <div className='mb-8 p-4 bg-secondary/50 rounded-lg'>
                  <span className='text-lg font-semibold mb-3 text-center'>
                    {t('adminActions')}
                  </span>
                  <div className='flex justify-center gap-4'>
                    <Button asChild variant='outline'>
                      <Link href={`/songs/${songSlug}/edit`}>
                        <Pencil className='mr-2' /> {t('edit')}
                      </Link>
                    </Button>
                    <DeleteSongDialog song={song}>
                      <Button variant='destructive'>
                        <Trash2 className='mr-2' /> {t('delete')}
                      </Button>
                    </DeleteSongDialog>
                  </div>
                </div>
              )}

              {/* Controles de Transposición */}
              <div className='space-y-4'>
                <TransposeControls
                  transposeAmount={transpose}
                  onUp={() => setTranspose((t) => t + 1)}
                  onDown={() => setTranspose((t) => t - 1)}
                  onReset={() => setTranspose(0)}
                />
              </div>

              {/* Botones para Compartir */}
              <div className='mt-8'>
                <h3 className='text-lg font-semibold mb-2 text-center'>
                  {t('share')}
                </h3>
                <div className='flex justify-center gap-4'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?text=${encodeURIComponent(
                          shareText
                        )}`,
                        '_blank'
                      )
                    }
                    aria-label={t('shareOnFacebook')}
                  >
                    <FacebookIcon className='h-5 w-5 text-blue-600' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          shareText
                        )}`,
                        '_blank'
                      )
                    }
                    aria-label={t('shareOnTwitter')}
                  >
                    <XTwitter className='h-5 w-5 text-blue-400' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() =>
                      window.open(
                        `https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `${shareText}`
                        )}`,
                        '_blank'
                      )
                    }
                    aria-label={t('shareOnWhatsApp')}
                  >
                    <WhatsAppIcon className='h-5 w-5 text-green-500' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() =>
                      window.open(
                        `https://t.me/share/url?url=${encodeURIComponent(
                          shareText
                        )}`,
                        '_blank'
                      )
                    }
                    aria-label={t('shareOnTelegram')}
                  >
                    <TelegramIcon className='h-5 w-5 text-blue-500' />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Columna derecha: Pestañas con acordes y letra */}
        <div className='lg:col-span-2'>
          <Tabs defaultValue='chords' className='w-full'>
            <TabsList>
              <TabsTrigger value='chords'>{t('chordsAndLyrics')}</TabsTrigger>
              <TabsTrigger value='lyrics'>{t('lyricsOnly')}</TabsTrigger>
            </TabsList>
            <TabsContent value='chords'>
              <Card>
                <CardContent className='p-6'>
                  <SongViewer chordSheet={songChords} transpose={transpose} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='lyrics'>
              <Card>
                <CardContent className='p-6'>
                  <div className='whitespace-pre-wrap font-sans text-base leading-relaxed'>
                    <SongLyrics chordSheet={songChords} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Sección de Canciones Sugeridas */}
      {uniqueSuggestedSongs.length > 0 && (
        <div className='mt-16'>
          <h4 className='text-3xl font-bold mb-6'>{t('suggestedSongs')}</h4>
          <div className='flex flex-col space-y-3'>
            {uniqueSuggestedSongs.map((s) => (
              <SongListItem key={`${s.id}`} song={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
