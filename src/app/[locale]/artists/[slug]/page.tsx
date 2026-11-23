import { Mic2 } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { JSX } from 'react'
import { ArtistDetailContent } from '@/components/artist-detail-content'
import { EmptyState } from '@/components/layout/empty-state'
import { PageShell } from '@/components/layout/page-header'
import { Link } from '@/i18n/navigation'
import {
  getArtistImage,
  getSongsByArtistSlug
} from '@/services/artists.service'

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const songs = await getSongsByArtistSlug(slug)
  const artistName =
    songs[0]?.artists.find((a) => a.slug === slug)?.name ??
    'Artista desconocido'

  const description = `Explora todas las canciones y tablaturas de ${artistName} en Rangel Guitar. Aprende a tocar sus éxitos en guitarra.`
  const title = `Canciones de ${artistName}`

  const image = `${decodeURIComponent(slug)}.webp`
  const imageUrl = image
    ? getArtistImage(image)
    : 'https://placehold.co/1200x630.png'

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
      images: [imageUrl]
    }
  }
}

/**
 * Página que muestra todas las canciones de un artista específico.
 * Es una página renderizar en el servidor (Server Component) que obtiene los datos en tiempo de compilación.
 * @param {{ params: { name: string } }} props - Las propiedades de la página, incluyendo el nombre del artista.
 * @returns {Promise<JSX.Element>} La página de detalle del artista.
 */
export default async function ArtistDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<JSX.Element> {
  const { slug } = await params
  const songs = await getSongsByArtistSlug(slug)

  if (!songs || songs.length === 0) {
    const t = await getTranslations('artistsPage')
    return (
      <PageShell size='narrow'>
        <EmptyState icon={Mic2} title={t('noSongs')}>
          <Link
            href='/artists'
            className='inline-flex h-10 items-center rounded-full border px-5 text-sm font-semibold transition-colors hover:bg-muted'
          >
            {t('back')}
          </Link>
        </EmptyState>
      </PageShell>
    )
  }

  const artistName =
    songs[0].artists.find((a) => a.slug === slug)?.name ?? 'Artista desconocido'
  const imageUrl = getArtistImage(`${decodeURIComponent(slug)}.webp`)

  return (
    <ArtistDetailContent
      artistName={artistName}
      imageUrl={imageUrl}
      songs={songs}
    />
  )
}
