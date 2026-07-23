'use client'

import { format } from 'date-fns'
import { enUS, es } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { type JSX, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { revalidateAfterRequestDelete } from '@/app/[locale]/admin/requests/actions'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useI18n } from '@/context/i18n-context'
import { deleteSongRequest } from '@/lib/client/requests'
import { supabase } from '@/lib/supabase'
import type { SongRequest } from '@/lib/types'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

/**
 * Componente de cliente que muestra el contenido de la página de solicitudes de administrador.
 * Renderiza una tabla con las solicitudes de canciones pendientes.
 * @returns {JSX.Element} El componente de contenido de solicitudes.
 */
export function AdminRequestsContent(): JSX.Element {
  // Estados para manejar las solicitudes, el estado de carga y la internacionalización.
  const [requests, setRequests] = useState<SongRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { language, t } = useI18n()

  // Configura el local para el formato de fecha según el idioma seleccionado.
  const locale = language === 'es' ? es : enUS
  const dateFormat =
    language === 'es'
      ? "d 'de' MMMM 'de' yyyy 'a las' HH:mm"
      : "MMM d, yyyy 'at' h:mm a"

  useEffect(() => {
    const fetchRequests: () => Promise<void> = async () => {
      const { data, error } = await supabase
        .from('songs_requests')
        .select('*')
        .order('requestedAt', { ascending: false })

      if (error != null) {
        console.error('Failed to fetch song requests:', error)
        toast.error('Failed to load requests.')
        setIsLoading(false)
      } else {
        setRequests(
          data.map((r) => ({ ...r, requestedAt: new Date(r.requestedAt) }))
        )
        setIsLoading(false)
      }
    }

    fetchRequests()

    const channel = supabase
      .channel(`song-requests-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'songs_requests' },
        () => {
          fetchRequests()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [])

  /**
   * Maneja la eliminación de una solicitud de canción.
   * @param {string} requestId - El ID de la solicitud a eliminar.
   */
  const handleDelete: (requestId: string) => Promise<void> = async (
    requestId: string
  ) => {
    const originalRequests = [...requests] // Guarda el estado original para posible reversión.

    // Actualización optimista: elimina la solicitud de la UI inmediatamente.
    setRequests((currentRequests) =>
      currentRequests.filter((req) => req.id !== requestId)
    )

    try {
      // Realiza la eliminación en la base de datos.
      await deleteSongRequest(requestId)
      // Revalida la ruta del lado del servidor.
      await revalidateAfterRequestDelete()
      toast.success(t('requestDeletedDescription'))
    } catch (error) {
      // Si hay un error, revierte la UI al estado original.
      if (error instanceof Error) {
        setRequests(originalRequests)
        toast.error(t('songRequestDeleteError'))
      }
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-8 w-1/2' />
          <Skeleton className='h-4 w-3/4 mt-2' />
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Renderiza la tabla de solicitudes.
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('songRequestsTitle')}</CardTitle>
        <CardDescription>{t('songRequestsDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          {requests.length === 0 && (
            <TableCaption>{t('noPendingRequests')}</TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead>{t('tableTitle')}</TableHead>
              <TableHead>{t('tableArtist')}</TableHead>
              <TableHead>{t('tableRequestDate')}</TableHead>
              <TableHead className='text-right'>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className='font-medium'>
                  {/* Enlace para ir a la página de agregar canción con los datos pre-rellenados. */}
                  <Link
                    href={`/admin/add-song?id=${
                      req.id
                    }&title=${encodeURIComponent(
                      req.title
                    )}&artist=${encodeURIComponent(req.artist)}`}
                    className='hover:underline'
                  >
                    {req.title}
                  </Link>
                </TableCell>
                <TableCell>{req.artist}</TableCell>
                <TableCell>
                  {format(new Date(req.requestedAt), dateFormat, { locale })}
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='rounded-full text-white hover:text-red-600 hover:bg-transparent'
                    onClick={async () => await handleDelete(req.id)}
                    aria-label={t('deleteRequest')}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
