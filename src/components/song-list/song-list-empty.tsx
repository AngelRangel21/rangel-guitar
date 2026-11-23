import { MusicIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'

/** Estado vacío cuando no hay canciones que mostrar. */
export function SongListEmpty(): JSX.Element {
  const t = useTranslations('songList')

  return (
    <div className='flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center'>
      <MusicIcon
        aria-hidden='true'
        className='size-10 text-muted-foreground/40'
      />
      <p className='max-w-sm text-muted-foreground'>{t('noSongsFound')}</p>
    </div>
  )
}
