import { Music, Pencil } from 'lucide-react'
import Link from 'next/link'
import type { JSX } from 'react'
import { DeleteArtistButton } from '@/components/delete-artist-button'
import { Button } from '@/components/ui/button'
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
      <Button variant='ghost' size='icon' className='size-8' asChild>
        <Link href={`/artists/${artist.slug}`} aria-label={viewSongsLabel}>
          <Music className='size-4' />
        </Link>
      </Button>
      <Button variant='outline' size='icon' className='size-8' asChild>
        <Link
          href={`/admin/artists/${artist.slug}/edit`}
          aria-label={editLabel}
        >
          <Pencil className='size-4' />
        </Link>
      </Button>
      <DeleteArtistButton
        artistId={artist.id}
        artistName={artist.name}
        imageUrl={artist.image_url}
      />
    </div>
  )
}
