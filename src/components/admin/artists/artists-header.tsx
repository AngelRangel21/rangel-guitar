import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { JSX } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ArtistsHeader({
  title,
  description,
  total
}: {
  title: string
  description: string
  total: number
}): JSX.Element {
  return (
    <CardHeader>
      <div className='flex items-start justify-between gap-4'>
        <div className='space-y-1'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className='flex items-center gap-2 shrink-0 mt-1'>
          <Button variant='default' size='sm' asChild>
            <Link href='/admin/upload-artist'>
              <Plus className='size-4' />
              Agregar
            </Link>
          </Button>
          <Badge variant='secondary'>
            {total} artista{total !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>
    </CardHeader>
  )
}
