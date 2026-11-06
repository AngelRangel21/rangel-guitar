import { Music, Pencil } from 'lucide-react'
import type { JSX } from 'react'
import { DeleteArtistButton } from '@/components/delete-artist-button'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import type { Artist } from '@/types/app.types'

export function ArtistsActions({
  artist,
  editLabel,
  viewSongsLabel
}: {
  artist: Artist
  editLabel: string
  viewSongsLabel: string
}): JSX.Element {
  return (
    <div className='flex justify-end gap-1'>
      <Button
        variant='ghost'
        size='icon'
        className='size-8'
        render={
          <Link
            href={{
              pathname: '/artists/[slug]',
              params: { slug: `${artist.slug}` }
            }}
            aria-label={viewSongsLabel}
          />
        }
      >
        <Music className='size-4' />
      </Button>
      <Button
        variant='outline'
        size='icon'
        className='size-8'
        render={
          <Link
            href={{
              pathname: '/admin/artists/[slug]/edit',
              params: { slug: `${artist.slug}` }
            }}
            aria-label={editLabel}
          />
        }
      >
        <Pencil className='size-4' />
      </Button>
      <DeleteArtistButton
        artistId={artist.id}
        artistName={artist.name}
        imageUrl={artist.image_url}
      />
    </div>
  )
}
