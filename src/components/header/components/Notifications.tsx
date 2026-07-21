import { Bell } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Link } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'
import type { SongRequest } from '@/lib/types'

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
      const { data: requests, error } = await supabase
        .from('songs_requests')
        .select('*')
        .order('requestedAt', { ascending: false })

      if (error == null && requests) {
        setNotifications({
          count: requests.length,
          recentRequests: requests
            .slice(0, 99)
            .map((r) => ({ ...r, requestedAt: new Date(r.requestedAt) }))
        })
      }
    }

    fetchInitialRequests()

    // 1. Creamos Y configuramos el canal en una sola cadena de comandos
    // Esto garantiza que el callback se añada ANTES de cualquier intento de suscripción
    const channelName = `notifs-${instanceId.replace(/:/g, '')}`
    const channel = supabase
      .channel(channelName) // Cambiamos el nombre para evitar conflictos con canales viejos
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'songs_requests'
        },
        () => {
          fetchInitialRequests()
        }
      )
      .subscribe()

    // 2. Limpieza total
    return () => {
      channel.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [isAdmin, instanceId]) // Añadimos supabase a las dependencias por seguridad

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
