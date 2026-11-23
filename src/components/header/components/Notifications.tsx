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
          className='relative inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          title={t('requests.title')}
          aria-label={
            notifications.count > 0
              ? `${t('requests.title')} (${notifications.count})`
              : t('requests.title')
          }
        >
          <Bell aria-hidden='true' className='size-5' />
          {notifications.count > 0 && (
            <span
              aria-hidden='true'
              className='absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white ring-2 ring-background'
            >
              {notifications.count > 99 ? '99+' : notifications.count}
            </span>
          )}
        </Link>
      )}
    </>
  )
}
