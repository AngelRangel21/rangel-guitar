import { User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { SongArtwork } from '@/components/song-artwork'
import { Link } from '@/i18n/navigation'
import { getArtistImage } from '@/services/artists.service'
import type { ArtistCount } from '@/types/app.types'

/** Tarjeta de un artista; al hacer clic abre su página de canciones. */
export function ArtistCard({ artist }: { artist: ArtistCount }): JSX.Element {
  const t = useTranslations('artistsPage')
  const imageUrl = artist.image_url ? getArtistImage(artist.image_url) : null

  return (
    <Link
      href={{ pathname: '/artists/[slug]', params: { slug: `${artist.slug}` } }}
      aria-label={t('viewArtist', { name: artist.name })}
      className='group flex flex-col items-center gap-3 rounded-2xl p-3 text-center transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    >
      <SongArtwork
        src={imageUrl}
        alt=''
        sizes='(min-width: 1024px) 15vw, (min-width: 640px) 25vw, 45vw'
        fallbackIcon={User}
        className='aspect-square w-full rounded-full ring-1 ring-border transition-shadow duration-300 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-foreground/20'
        imageClassName='transition-transform duration-500 group-hover:scale-105'
      />
      <div className='min-w-0 max-w-full'>
        <h3 className='truncate font-semibold text-foreground'>
          {artist.name}
        </h3>
        <p className='text-sm text-muted-foreground'>
          {t('songCount', { count: artist.count ?? 0 })}
        </p>
      </div>
    </Link>
  )
}
