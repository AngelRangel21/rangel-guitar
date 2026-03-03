import { getSongBySlug } from '@/services/songs-service'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SongDisplay } from '@/components/song-display'
import type { Song } from '@/types'
import { getSongs } from '@/services/song.service'
import { JSX } from 'react'

/**
 * Genera los parámetros estáticos para todas las páginas de canciones en tiempo de compilación.
 * Esto permite a Next.js pre-renderizar cada página de canción, mejorando el rendimiento.
 * @returns {Promise<{ slug: string }[]>} Un array de objetos con los slugs de todas las canciones.
 */
export async function generateStaticParams () {
  const songs = await getSongs()
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
      title: 'Canción no encontrada'
    }
  }

  const songSlice = `${song.lyrics}`.slice(0, 55)

  const description = `${song.artist} - ${song.title} letra, acordes y video disponibles para practicar disponible en Rangel Guitar. - ${songSlice}`

  return {
    title: `${song.title} - ${song.artist}`,
    description,
    openGraph: {
      title: `${song.title} - ${song.artist}`,
      description,
      type: 'music.song',
      url: `/songs/${song.slug}`,
      images: [
        {
          url: song.coverArt,
          width: 600,
          height: 600,
          alt: `Portada de ${song.title}`
        }
      ]
    },
    twitter: {
      title: `${song.title} - ${song.artist}`,
      description,
      card: 'summary_large_image',
      images: [song.coverArt],
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
  if (song == null) {
    notFound()
  }

  // --- Lógica de Sugerencias ---
  const allSongs = await getSongs()
  const MAX_SUGGESTIONS = 6

  // 1. Obtiene otras canciones del mismo artista.
  let suggestedSongs: Song[] = allSongs.filter(
    (s) => s.artist === song.artist && s.id !== song.id
  )

  // 2. Si no hay suficientes, obtiene canciones aleatorias de otros artistas.
  if (suggestedSongs.length < MAX_SUGGESTIONS) {
    const otherSongs = allSongs.filter(
      (s) => s.artist !== song.artist && s.id !== song.id
    )

    const remainingNeeded = MAX_SUGGESTIONS - suggestedSongs.length

    // Mezcla las otras canciones para obtener una selección aleatoria.
    const shuffledOtherSongs = otherSongs.sort(() => 0.5 - Math.random())

    suggestedSongs.push(...shuffledOtherSongs.slice(0, remainingNeeded))
  }

  // 3. Se asegura de no exceder el número máximo de sugerencias.
  suggestedSongs = suggestedSongs.slice(0, MAX_SUGGESTIONS)
  // --- Fin de la Lógica de Sugerencias ---

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <main className='grow container mx-auto px-4 py-8 opacity-0 animate-content-in'>
        {/* Componente de cliente que maneja la visualización interactiva de la canción. */}
        <SongDisplay song={song} suggestedSongs={suggestedSongs} />
      </main>
    </div>
  )
}
