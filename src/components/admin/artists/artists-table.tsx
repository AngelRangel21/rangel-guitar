import Link from 'next/link'
import type { JSX } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { Artist } from '@/types/app.types'
import { ArtistsActions } from './artists-actions'

function formatDate(dateStr: string, locale: string): string {
  const formatter = new Intl.DateTimeFormat(
    locale === 'es' ? 'es-MX' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  )
  return formatter.format(new Date(dateStr))
}

export function ArtistsTable({
  artists,
  locale,
  artistLabel,
  slugLabel,
  createdAtLabel,
  actionsLabel,
  noArtistsLabel,
  editLabel,
  viewSongsLabel
}: {
  artists: Artist[]
  locale: string
  artistLabel: string
  slugLabel: string
  createdAtLabel: string
  actionsLabel: string
  noArtistsLabel: string
  editLabel: string
  viewSongsLabel: string
}): JSX.Element {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='min-w-50'>{artistLabel}</TableHead>
          <TableHead className='hidden md:table-cell'>{slugLabel}</TableHead>
          <TableHead className='hidden lg:table-cell'>
            {createdAtLabel}
          </TableHead>
          <TableHead className='text-right'>{actionsLabel}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {artists.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={4}
              className='text-center text-muted-foreground py-8'
            >
              {noArtistsLabel}
            </TableCell>
          </TableRow>
        )}
        {artists.map((artist) => (
          <TableRow key={artist.id}>
            <TableCell>
              <div className='flex items-center gap-3'>
                <Avatar className='size-9 shrink-0'>
                  {artist.image_url && (
                    <AvatarImage src={artist.image_url} alt={artist.name} />
                  )}
                  <AvatarFallback className='text-xs font-medium'>
                    {artist.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0'>
                  <Link
                    href={`/artists/${artist.slug}`}
                    className='font-medium hover:underline truncate block'
                  >
                    {artist.name}
                  </Link>
                  <span className='text-xs text-muted-foreground md:hidden'>
                    {artist.slug}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell className='hidden md:table-cell text-muted-foreground'>
              {artist.slug}
            </TableCell>
            <TableCell className='hidden lg:table-cell text-muted-foreground'>
              {formatDate(artist.created_at, locale)}
            </TableCell>
            <TableCell className='text-right'>
              <ArtistsActions
                artist={artist}
                editLabel={editLabel}
                viewSongsLabel={viewSongsLabel}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
