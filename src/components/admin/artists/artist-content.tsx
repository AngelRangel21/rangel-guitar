import { getTranslations } from 'next-intl/server'
import type { JSX } from 'react'
import { ArtistsHeader } from '@/components/admin/artists/artists-header'
import { ArtistsTable } from '@/components/admin/artists/artists-table'
import { Card, CardContent } from '@/components/ui/card'
import { getArtists } from '@/services/artists.service'

export async function ArtistsContent({
  locale
}: {
  locale: string
}): Promise<JSX.Element> {
  const t = await getTranslations({ locale, namespace: 'admin.artists' })
  const artists = await getArtists()

  return (
    <Card>
      <ArtistsHeader
        title={t('title')}
        description={t('description')}
        total={artists.length}
      />
      <CardContent>
        <ArtistsTable
          artists={artists}
          locale={locale}
          artistLabel={t('artist')}
          slugLabel={t('slug')}
          createdAtLabel={t('createdAt')}
          actionsLabel={t('actions')}
          noArtistsLabel={t('noArtists')}
          editLabel={t('edit')}
          viewSongsLabel={t('viewSongs')}
        />
      </CardContent>
    </Card>
  )
}
