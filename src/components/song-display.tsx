'use client'

import { useState, useEffect, JSX } from 'react'
import type { SongWithArtist } from '@/types/app.types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChordSheet } from './chord-sheet'
import { Minus, Plus, Pencil, Trash2 } from 'lucide-react'
import {
  WhatsAppIcon,
  TelegramIcon,
  XTwitter,
  FacebookIcon
} from '@/components/icons'
import { useI18n } from '@/context/i18n-context'
import { useAuth } from '@/hooks/useAuth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DeleteSongDialog } from './delete-song-dialog'
import Link from 'next/link'
import { SongListItem } from './song-list-item'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import { FavoriteButton } from './favorite-button'

/**
 * Componente principal para mostrar una canción.
 * Incluye la portada, controles de transposición, botones para compartir,
 * la hoja de acordes/letra, y sugerencias de otras canciones.
 * @param {{ song: Song, suggestedSongs: Song[] }} props - Datos de la canción y sugerencias.
 * @returns {JSX.Element} El componente de visualización de la canción.
 */
export function SongDisplay ({
  song,
  suggestedSongs
}: {
  song: SongWithArtist
  suggestedSongs: SongWithArtist[]
}): JSX.Element {
  const [transpose, setTranspose] = useState(0)
  const { t } = useI18n()
  const { isAdmin } = useAuth()
  const [currentUrl, setCurrentUrl] = useState('')
  const artistsName = song.artists.map(a => a.name).join(', ') ?? 'Artista desconocido'
  const songTitle = song.title ?? 'Sin titulo'
  const songSlug = song.slug ?? 'Sin slug'
  const songVideo = song.video ?? ''
  const songChords = song.chords ?? ''
  const songLyrics = song.lyrics ?? ''

  // Efecto para obtener la URL actual y registrar la visita a la canción.
  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [song.id])

  /**
   * Genera el texto que describe el estado de la transposición.
   * @returns {string} - El texto descriptivo (ej. "Tono Original", "+2 semitonos").
   */
  const getTransposedKeyText = () => {
    if (transpose === 0) return t('originalKey')
    const direction = transpose > 0 ? `+${transpose}` : transpose
    return `${direction} ${t('semitones')}`
  }

  const shareText = t('shareText', { title: songTitle, artist: artistsName })

  return (
    <div className='opacity-0 animate-content-in'>
      <div className='grid lg:grid-cols-3 gap-8'>
        {/* Columna izquierda: Portada, controles y metadatos */}
        <div className='lg:col-span-1'>
          <Card className='overflow-hidden lg:sticky lg:top-24'>
            {songVideo !== null &&
              (
                <div className='w-full aspect-video'>
                  <LiteYouTubeEmbed
                    id={`${songVideo}`}
                    title={`Video de la canción ${songTitle} del artista ${artistsName}`}
                    lazyLoad
                    poster='maxresdefault'
                    webp
                  />
                </div>
              )}
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle className='text-2xl'>{songTitle}</CardTitle>
                  <CardDescription>{artistsName}</CardDescription>
                </div>
                {/* Botón de Favoritos (solo para usuarios autenticados) */}
                <FavoriteButton song={song} />
              </div>
            </CardHeader>
            <CardContent>
              {/* Acciones de Administrador (solo para administradores) */}
              {isAdmin && (
                <div className='mb-8 p-4 bg-secondary/50 rounded-lg'>
                  <h2 className='text-lg font-semibold mb-3 text-center'>
                    {t('adminActions')}
                  </h2>
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
                <div>
                  <h3 className='text-lg font-semibold mb-2 text-center'>
                    {t('changeTone')}
                  </h3>
                  <div className='flex items-center justify-between gap-4'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setTranspose((t) => t - 1)}
                      aria-label={t('decreaseSemitone')}
                    >
                      <Minus className='h-4 w-4' />
                    </Button>
                    <span
                      className='font-bold text-lg w-32 text-center'
                      aria-live='polite'
                    >
                      {getTransposedKeyText()}
                    </span>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setTranspose((t) => t + 1)}
                      aria-label={t('increaseSemitone')}
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                  {transpose !== 0
                    ? (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setTranspose(0)}
                        className='w-full mt-4'
                      >
                        {t('resetTone')}
                      </Button>
                      )
                    : (
                      <Button
                        variant='ghost'
                        disabled
                        size='sm'
                        className='w-full mt-4'
                      >
                        {t('resetTone')}
                      </Button>
                      )}
                </div>
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
                        `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
                        '_blank'
                      )}
                    aria-label={t('shareOnFacebook')}
                  >
                    <FacebookIcon className='h-5 w-5 text-blue-600' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${currentUrl}&text=${encodeURIComponent(
                          shareText
                        )}`,
                        '_blank'
                      )}
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
                          `${shareText} ${currentUrl}`
                        )}`,
                        '_blank'
                      )}
                    aria-label={t('shareOnWhatsApp')}
                  >
                    <WhatsAppIcon className='h-5 w-5 text-green-500' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() =>
                      window.open(
                        `https://t.me/share/url?url=${currentUrl}&text=${encodeURIComponent(
                          shareText
                        )}`,
                        '_blank'
                      )}
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
                  <ChordSheet text={songChords} transpose={transpose} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='lyrics'>
              <Card>
                <CardContent className='p-6'>
                  <div className='whitespace-pre-wrap font-sans text-base leading-relaxed'>
                    {songLyrics}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Sección de Canciones Sugeridas */}
      {suggestedSongs.length > 0 && (
        <div className='mt-16'>
          <h4 className='text-3xl font-bold mb-6'>{t('suggestedSongs')}</h4>
          <div className='flex flex-col space-y-3'>
            {suggestedSongs.map((s) => (
              <SongListItem key={s.id} song={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
