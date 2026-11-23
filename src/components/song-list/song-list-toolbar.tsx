import { ArrowDownAZ, Clock, LayoutGrid, List } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { SegmentedControl } from '@/components/layout/segmented-control'
import type { SongListSort, SongListView } from './song-list.types'

interface SongListToolbarProps {
  total: number
  /** Primera canción visible (1-based). */
  rangeStart: number
  /** Última canción visible (1-based). */
  rangeEnd: number
  hasMultiplePages: boolean
  sort: SongListSort
  onSortChange: (sort: SongListSort) => void
  view: SongListView
  onViewChange: (view: SongListView) => void
}

/** Barra superior de la lista: contador, orden y tipo de vista. */
export function SongListToolbar({
  total,
  rangeStart,
  rangeEnd,
  hasMultiplePages,
  sort,
  onSortChange,
  view,
  onViewChange
}: SongListToolbarProps): JSX.Element {
  const t = useTranslations('songList')

  return (
    <div className='flex flex-wrap items-center justify-between gap-3 border-b pb-3'>
      <p className='text-sm text-muted-foreground' aria-live='polite'>
        {hasMultiplePages
          ? t('range', { start: rangeStart, end: rangeEnd, total })
          : t('count', { count: total })}
      </p>

      <div className='flex items-center gap-2'>
        <SegmentedControl<SongListSort>
          label={t('sort.label')}
          value={sort}
          onChange={onSortChange}
          options={[
            { value: 'recent', label: t('sort.recent'), icon: <Clock /> },
            {
              value: 'alphabetical',
              label: t('sort.alphabetical'),
              icon: <ArrowDownAZ />
            }
          ]}
        />
        <SegmentedControl<SongListView>
          label={t('viewLabel')}
          value={view}
          onChange={onViewChange}
          iconOnly
          options={[
            { value: 'list', label: t('list.listView'), icon: <List /> },
            { value: 'grid', label: t('grid.gridView'), icon: <LayoutGrid /> }
          ]}
        />
      </div>
    </div>
  )
}
