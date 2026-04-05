import { getSongBySlug, getSongByArtist } from '@/services/song.service'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SongDisplay } from '@/components/song-display'
import { JSX } from 'react'

/**
 * Genera los parámetros estáticos para todas las páginas de canciones en tiempo de compilación.
 * Esto permite a Next.js pre-renderizar cada página de canción, mejorando el rendimiento.
 * @returns {Promise<{ slug: string }[]>} Un array de objetos con los slugs de todas las canciones.
 */
export async function generateStaticParams (): Promise<Array<{
  slug: string | null
}>> {
  const songs = await getSongByArtist()
  return songs.map((song) => ({ slug: song.slug }))
}

/**
 * Genera los metadatos (título, descripción, imagen) para la página de una canción específica.
 * Es crucial para el SEO y para cómo se muestra la página al compartirla en redes sociales.
 * @param {{ params: { slug: string } }} props - Las propiedades de la página, incluyendo el slug de la canción.
 * @returns {Promise<Metadata>} El objeto de metadatos para la página.
 */
export async function generateMetadata ({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const song = await getSongBySlug(slug)

  if (song == null) {
    return {
      title: 'Canción no encontrada - Rangel Guitar'
    }
  }

  const artistsName = song?.artists?.map(a => a.name).join(', ') ?? 'Artista desconocido'
  const songTitle = song?.title ?? 'Sin titulo'
  const songSlug = song?.slug ?? 'Sin slug'
  const songCover = song?.coverArt ?? ''
  const songLyrics = song?.lyrics ?? ''

  const songSlice = `${songLyrics}`.slice(0, 50) ?? ''

  const description = `${artistsName} - ${songTitle} letra, acordes y video disponibles para practicar disponible en Rangel Guitar. - ${songSlice}`

  return {
    title: `${songTitle} - ${artistsName}`,
    description,
    openGraph: {
      title: `${songTitle} - ${artistsName}`,
      description,
      type: 'music.song',
      url: `/songs/${songSlug}`,
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
      title: `${songTitle} - ${artistsName}`,
      description,
      card: 'summary_large_image',
      images: [songCover],
      creator: '@rangelguitar'
    },
    verification: {
      google: 'google-site-verification-code' // Placeholder
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

/**
 * Página que muestra los detalles de una canción específica (letra, acordes, video, etc.).
 * @param {{ params: { slug: string } }} props - Las propiedades de la página, incluyendo el slug.
 * @returns {Promise<JSX.Element>} La página de la canción.
 */
export default async function SongPage ({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<JSX.Element> {
  const { slug } = await params

  // Obtiene los datos de la canción a partir de su slug.
  const song = await getSongBySlug(slug)

  // Si la canción no existe, muestra la página 404.
  if (song != null) {
    notFound()
  }

  // --- Lógica de Sugerencias ---
  const allSongs = await getSongByArtist()
  const MAX_SUGGESTIONS = 6

  // IDs de los artistas de la canción actual para comparar
  const currentArtistIds = song?.artists?.map(a => a.id)

  // 1. Obtiene otras canciones del mismo artista.
  let suggestedSongs = allSongs.filter(s =>
    s.id !== song?.id &&
    s.artists.some(a => currentArtistIds?.includes(a.id))
  )

  // 2. Si no hay suficientes, obtiene canciones aleatorias de otros artistas.
  if (suggestedSongs.length < MAX_SUGGESTIONS) {
    const otherSongs = allSongs.filter(s =>
      s.id !== song?.id &&
      (suggestedSongs.find(alreadySuggested => alreadySuggested.id === song?.id) == null)
    )

    // Mezcla las otras canciones para obtener una selección aleatoria.
    const shuffledOtherSongs = otherSongs.sort(() => 0.5 - Math.random())

    suggestedSongs = [...suggestedSongs, ...shuffledOtherSongs].slice(0, MAX_SUGGESTIONS)
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
