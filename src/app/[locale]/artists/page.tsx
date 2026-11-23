import { Mic2, Music2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { JSX } from 'react'
import { ArtistList } from '@/components/artist-list'
import {
  HeaderStat,
  PageHeader,
  PageShell
} from '@/components/layout/page-header'
import { getArtists } from '@/services/artists.service'

export default async function ArtistsPage(): Promise<JSX.Element> {
  const t = await getTranslations('artistsPage')
  const artists = await getArtists()
  const songTotal = artists.reduce(
    (sum, artist) => sum + (artist.count ?? 0),
    0
  )

  return (
    <PageShell>
      <PageHeader
        eyebrow={{ icon: Mic2, label: t('eyebrow') }}
        title={t('title')}
        description={t('description')}
      >
        <div className='flex flex-wrap gap-2'>
          <HeaderStat icon={Mic2}>
            {t('artistCount', { count: artists.length })}
          </HeaderStat>
          <HeaderStat icon={Music2}>
            {t('songCount', { count: songTotal })}
          </HeaderStat>
        </div>
      </PageHeader>

      <ArtistList artists={artists} />
    </PageShell>
  )
}
