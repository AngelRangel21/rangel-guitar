import type { JSX } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const SKELETON_ROWS = Array.from({ length: 5 }, (_, i) => i)

export function ArtistsLoader(): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-8 w-1/3' />
        <Skeleton className='h-4 w-1/2 mt-2' />
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {SKELETON_ROWS.map((i) => (
            <div key={i} className='flex items-center gap-4'>
              <Skeleton className='size-9 rounded-full' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-1/3' />
                <Skeleton className='h-3 w-1/4' />
              </div>
              <Skeleton className='size-8 shrink-0 rounded-md' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
