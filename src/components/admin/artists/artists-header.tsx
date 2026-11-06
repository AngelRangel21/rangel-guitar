import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'

export function ArtistsHeader({
  title,
  description,
  total
}: {
  title: string
  description: string
  total: number
}): JSX.Element {
  const t = useTranslations('artistHeader')
  return (
    <CardHeader>
      <div className='flex items-start justify-between gap-4'>
        <div className='space-y-1'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className='flex items-center gap-2 shrink-0 mt-1'>
          <Button
            variant='default'
            size='sm'
            render={<Link href='/admin/upload-artist' />}
          >
            <Plus className='size-4' />
            {t('add')}
          </Button>
          <Badge variant='secondary'>
            {total} {t('artist', { word: total !== 1 ? 's' : '' })}
          </Badge>
        </div>
      </div>
    </CardHeader>
  )
}
