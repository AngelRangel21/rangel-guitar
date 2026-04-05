import type { Metadata } from 'next'
import { ArtistDetailContent } from '@/components/artist-detail-content'
import { JSX } from 'react'
import { getArtistImage, getSongsByArtistSlug } from '@/services/artists.service'

export async function generateMetadata ({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const songs = await getSongsByArtistSlug(slug)
  const artistName = songs[0]?.artists.find(a => a.slug === slug)?.name ?? 'Artista desconocido'

  const description = `Explora todas las canciones y tablaturas de ${artistName} en Rangel Guitar. Aprende a tocar sus éxitos en guitarra.`
  const title = `Canciones de ${artistName}`

  const image = `${decodeURIComponent(slug)}.webp`
  const imageUrl = image ? getArtistImage(image) : 'https://placehold.co/1200x630.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Canciones de ${artistName} en Rangel Guitar`
        }
      ]
    },
    twitter: {
      title: `${title}`,
      description,
      creator: '@rangelguitar',
      images: [
        imageUrl
      ]
    }
  }
}

/**
 * Página que muestra todas las canciones de un artista específico.
 * Es una página renderizar en el servidor (Server Component) que obtiene los datos en tiempo de compilación.
 * @param {{ params: { name: string } }} props - Las propiedades de la página, incluyendo el nombre del artista.
 * @returns {Promise<JSX.Element>} La página de detalle del artista.
 */
export default async function ArtistDetailPage ({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<JSX.Element> {
  const { slug } = await params
  const songs = await getSongsByArtistSlug(slug)

  if (!songs || songs.length === 0) {
    return <div>No se encontraron canciones.</div>
  }

  const currentArtist = songs[0].artists.find(a => a.slug === slug)?.name
  const artistName = songs.length > 0
    ? currentArtist
    : 'Artista desconocido'

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      {/* El contenido principal se delega a un Client Component para permitir interactividad y hooks. */}
      <ArtistDetailContent artistName={artistName} songs={songs} />
    </div>
  )
}
