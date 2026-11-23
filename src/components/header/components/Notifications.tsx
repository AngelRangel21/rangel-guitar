import { Bell } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Link } from '@/i18n/navigation'
import type { SongRequest } from '@/lib/types'
import {
  getSongRequests,
  subscribeToSongRequests
} from '@/services/song-requests.service'

export function Notifications() {
  const instanceId = useId()
  const t = useTranslations('header')
  const { isAdmin } = useAuth()
  const [notifications, setNotifications] = useState<{
    count: number
    recentRequests: SongRequest[]
  }>({ count: 0, recentRequests: [] })

  useEffect(() => {
    if (!isAdmin) {
      setNotifications({ count: 0, recentRequests: [] })
      return
    }

    const fetchInitialRequests = async () => {
      try {
        const requests = await getSongRequests()
        setNotifications({
          count: requests.length,
          recentRequests: requests
            .slice(0, 99)
            .map((r) => ({ ...r, requestedAt: new Date(r.requestedAt) }))
        })
      } catch (error) {
        console.error('Error loading song requests:', error)
      }
    }

    fetchInitialRequests()

    // Un canal por instancia para evitar conflictos al montar varias veces.
    return subscribeToSongRequests(
      `notifs-${instanceId.replace(/:/g, '')}`,
      fetchInitialRequests
    )
  }, [isAdmin, instanceId])

  return (
    <>
      {isAdmin && (
        <Link
          href='/admin/requests'
          className='inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors size-10 relative hover:bg-primary-foreground/10 rounded-full'
          title={t('requests.title')}
        >
          <Bell />
          {notifications.count > 0 && (
            <span className='absolute top-0 right-1 flex size-5 items-center justify-center rounded-full bg-destructive p-1 text-xs font-bold text-destructive-foreground'>
              {notifications.count}
            </span>
          )}
        </Link>
      )}
    </>
  )
}
