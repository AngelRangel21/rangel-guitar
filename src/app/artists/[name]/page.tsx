import type { Metadata } from 'next'
import { getSongsByArtist } from '@/services/songs-service'
import { notFound } from 'next/navigation'
import { ArtistDetailContent } from '@/components/artist-detail-content'
import { JSX } from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

// No necesitamos generateStaticParams ya que usaremos generación dinámica

/**
 * Genera los metadatos (título, descripción, etc.) para la página de un artista específico.
 * Es crucial para el SEO y para cómo se muestra la página al compartirla en redes sociales.
 * @param {{ params: { name: string } }} props - Las propiedades de la página, incluyendo el nombre del artista desde la URL.
 * @returns {Promise<Metadata>} El objeto de metadatos para la página.
 */
export async function generateMetadata ({
  params
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const { name } = await params
  const artistName = decodeURIComponent(name)

  const description = `Explora todas las canciones y tablaturas de ${artistName} en Rangel Guitar. Aprende a tocar sus éxitos en guitarra.`
  const title = `Canciones de ${artistName}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: 'https://placehold.co/1200x630.png',
          width: 1200,
          height: 630,
          alt: `Canciones de ${artistName} en Rangel Guitar`
        }
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
  params: Promise<{ name: string }>
}): Promise<JSX.Element> {
  try {
    const { name } = await params
    // Decodifica el nombre del artista desde la URL (ej. "Guns%20N'%20Roses" -> "Guns N' Roses").
    const artistName = decodeURIComponent(name)
    // Obtiene todas las canciones del artista desde el servicio.
    const artistSongs = await getSongsByArtist(artistName)

    // Si no se encuentran canciones, muestra la página de error 404.
    if (!artistSongs || artistSongs.length === 0) {
      notFound()
    }

    return (
      <div className='flex flex-col min-h-screen bg-background'>
        {/* El contenido principal se delega a un Client Component para permitir interactividad y hooks. */}
        <ArtistDetailContent artistName={artistName} songs={artistSongs} />
      </div>
    )
  } catch (error) {
    console.error('Error loading artist page:', error)
    return (
      <div className='flex flex-col min-h-screen bg-background'>
        <div className='grow container mx-auto px-4 py-8 flex items-center justify-center'>
          <p className='text-lg text-red-500'>
            Error al cargar las canciones del artista. Por favor, intenta de
            nuevo más tarde.
          </p>
        </div>
      </div>
    )
  }
}
