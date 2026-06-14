import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import type { JSX } from 'react'
import { SongDisplay } from '@/components/song-display'
import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { getSongByArtist, getSongBySlug } from '@/services/song.service'

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params

  const t = await getTranslations({ locale, namespace: 'songPage.Metadata' })
  const song = await getSongBySlug(slug)

  if (song == null) {
    return {
      title: t('title')
    }
  }

  const artistsName =
    song?.artists?.map((a) => a.name).join(', ') ?? t('notArtists')
  const songTitle = song?.title ?? t('notTitle')
  const songSlug = song?.slug ?? t('notSlug')
  const songCover = song?.coverArt ?? ''
  const songLyrics = song?.lyrics ?? ''

  const cleanLirycs =
    songLyrics
      ?.replace(/\n/g, ' ')
      .replace(/\r/g, '')
      .replace(/\s+/g, ' ')
      .trim() ?? ''

  const songSlice =
    cleanLirycs.length > 0 ? `${cleanLirycs.slice(0, 90)}` : cleanLirycs

  const description = `Aprende la letra y acordes de la canción ${songTitle} de ${artistsName}. ${t('description')} ${songSlice}`

  const pathname = getPathname({
    locale: locale,
    href: {
      pathname: '/songs/[slug]',
      params: { slug: songSlug }
    }
  })

  const languages = Object.fromEntries(
    routing.locales.map((lang) => [
      lang,
      `https://rangelguitar.com${getPathname({
        locale: lang,
        href: { pathname: '/songs/[slug]', params: { slug: songSlug } }
      })}`
    ])
  )

  languages['x-default'] = `https://rangelguitar.com${getPathname({
    locale: 'es',
    href: { pathname: '/songs/[slug]', params: { slug: songSlug } }
  })}`

  return {
    title: {
      default: `${songTitle} de ${artistsName} - Letra y Acordes`,
      template: '%s | Rangel Guitar'
    },
    description,
    alternates: {
      canonical: `https://rangelguitar.com${pathname}`,
      languages: languages
    },
    openGraph: {
      title: `${songTitle} de ${artistsName} - Letra y Acordes`,
      description,
      type: 'music.song',
      url: `https://rangelguitar.com${pathname}`,
      images: [
        {
          url: songCover,
          width: 600,
          height: 600,
          alt: `Portada de ${songTitle}`
        }
      ]
    },
    twitter: {
      title: `${songTitle} de ${artistsName} - Letra y Acordes`,
      description,
      card: 'summary_large_image',
      images: [songCover],
      creator: '@rangelguitar'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}

export default async function SongPage({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<JSX.Element> {
  const { slug } = await params

  // Obtiene los datos de la canción a partir de su slug.
  const song = await getSongBySlug(slug)

  // Si la canción no existe, muestra la página 404.
  if (song == null) {
    notFound()
  }

  // --- Lógica de Sugerencias ---
  const allSongs = await getSongByArtist()
  const MAX_SUGGESTIONS = 6

  // IDs de los artistas de la canción actual para comparar
  const currentArtistIds = song?.artists?.map((a) => a.id)

  // 1. Obtiene otras canciones del mismo artista.
  let suggestedSongs = allSongs.filter(
    (s) =>
      s.id !== song?.id &&
      s.artists.some((a) => currentArtistIds?.includes(a.id))
  )

  // 2. Si no hay suficientes, obtiene canciones aleatorias de otros artistas.
  if (suggestedSongs.length < MAX_SUGGESTIONS) {
    const otherSongs = allSongs.filter(
      (s) =>
        s.id !== song?.id &&
        suggestedSongs.find(
          (alreadySuggested) => alreadySuggested.id === song?.id
        ) == null
    )

    // Mezcla las otras canciones para obtener una selección aleatoria.
    const shuffledOtherSongs = otherSongs.sort(() => 0.5 - Math.random())

    suggestedSongs = [...suggestedSongs, ...shuffledOtherSongs].slice(
      0,
      MAX_SUGGESTIONS
    )
  }

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <main className='grow container mx-auto px-4 py-8 opacity-0 animate-content-in'>
        {/* Componente de cliente que maneja la visualización interactiva de la canción. */}
        <SongDisplay song={song} suggestedSongs={suggestedSongs} />
      </main>
    </div>
  )
}
