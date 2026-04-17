'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type JSX, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { useAuthStore } from '@/auth/stores/auth.stores'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/context/i18n-context'
import { addSongRequest } from '@/lib/client/requests'
import { Spinner } from './ui/spinner'

/**
 * Esquema de validación del formulario de solicitud de canciones con Zod.
 */
const formSchema = z.object({
  title: z.string().min(1, { message: 'songTitleRequired' }),
  artist: z.string().min(1, { message: 'artistNameRequired' })
})

/**
 * Componente del formulario para que los usuarios soliciten nuevas canciones.
 * @returns {JSX.Element} El formulario de solicitud de canciones.
 */
export function RequestSongForm(): JSX.Element {
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const user = useAuthStore((s) => s.user)

  // Inicializa el formulario con react-hook-form y el resolver de Zod.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      artist: ''
    }
  })

  /**
   * Maneja el envío del formulario.
   * @param {z.infer<typeof formSchema>} values - Los datos del formulario validados.
   */
  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    if (user == null) {
      toast.error('Debes de iniciar sesión para hacer una solicitud')
      return
    }

    setIsLoading(true)
    try {
      // Llama a la función del cliente para agregar la solicitud a Supabase.
      await addSongRequest({
        title: values.title,
        artist: values.artist,
        user_id: user.uid
      })
      toast.success(
        `¡Tu solicitud para "${values.title}" de "${values.artist}" ha sido enviada! La revisaremos pronto.`
      )
      form.reset() // Limpia el formulario después de un envío exitoso.
    } catch (error) {
      toast.error(t('requestErrorDescription'))
      console.error(t('requestErrorDescription'), error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle>{t('requestSongTitle')}</CardTitle>
        <CardDescription>{t('requestSongDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('songTitleLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('songTitlePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='artist'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('artistLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('artistPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='w-full'
              disabled={isLoading || user == null}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <p>{`${t('sending')}...`}</p>
                </>
              ) : (
                t('sendRequest')
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
