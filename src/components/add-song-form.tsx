'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { revalidateAndRedirect } from '@/app/[locale]/admin/add-song/actions'
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
import { Textarea } from '@/components/ui/textarea'
import { deleteSongRequest } from '@/lib/client/requests'
import { addSong, type NewSongData } from '@/lib/client/songs'
import { createSlug } from '@/lib/utils'
import { Spinner } from './ui/spinner'

/**
 * Propiedades que el componente AddSongForm espera recibir.
 */
interface AddSongFormProps {
  requestId: string
  initialTitle: string
  initialArtist: string
}

/**
 * Esquema de validación del formulario utilizando Zod.
 * Define la estructura y las reglas de los datos del formulario.
 */
const formSchema = z.object({
  title: z.string().min(1, { message: 'El título es obligatorio.' }),
  artist: z.string().min(1, { message: 'El artista es obligatorio.' }),
  lyrics: z.string().optional(),
  chords: z.string().optional(),
  video: z.string().optional(),
  coverArt: z.string().url({ message: 'Debe ser una URL válida.' })
})

/**
 * Formulario para que los administradores agreguen una nueva canción,
 * generalmente en respuesta a una solicitud de un usuario.
 * @param {AddSongFormProps} props - Propiedades con datos de la solicitud.
 * @returns {JSX.Element} El componente del formulario.
 */
export function AddSongForm({
  requestId,
  initialTitle,
  initialArtist
}: AddSongFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Inicialización de react-hook-form con el esquema de Zod.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialTitle,
      artist: initialArtist,
      lyrics: '',
      chords: '',
      video: '',
      coverArt: 'https://img.youtube.com/vi/ID_VIDEO/maxresdefault.jpg'
    }
  })

  /**
   * Función que se ejecuta al enviar el formulario.
   * @param {z.infer<typeof formSchema>} values - Los datos del formulario validados.
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const slug = createSlug(values.title)
      const songData: NewSongData = {
        title: values.title,
        artist_id: values.artist,
        slug,
        lyrics: values.lyrics ?? null,
        chords: values.chords ?? null,
        video: values.video ?? null,
        coverArt: values.coverArt
      }

      // Ejecuta las escrituras en la base de datos del lado del cliente.
      await addSong(songData) // Agrega la nueva canción.
      await deleteSongRequest(requestId) // Elimina la solicitud completada.

      // Llama a la acción del servidor para revalidar rutas y redirigir.
      await revalidateAndRedirect(values.artist, slug)
    } catch (error) {
      if (error) {
        console.error('Failed to add song and remove request:', error)
        toast.error('No se pudo agregar la canción. Intenta de nuevo.')
      } else {
        setIsLoading(false)
      }
    }
  }

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>Agregar Nueva Canción</CardTitle>
        <CardDescription>
          Completa los detalles de la canción solicitada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Artista</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='chords'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acordes y Letra</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='[Intro]\nC G Am F\n\n[Verse]\nC\nLa primera línea de la canción...'
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lyrics'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solo Letra</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='La primera línea de la canción...'
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='video'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID del Video de YouTube (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder='dQw4w9WgXcQ' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='coverArt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la Portada</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner /> <p>Agregando...</p>
                </>
              ) : (
                'Agregar Canción y Completar Solicitud'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
