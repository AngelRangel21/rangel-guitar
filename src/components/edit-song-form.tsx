'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { revalidateAndRedirectAfterEdit } from '@/app/[locale]/songs/[slug]/edit/actions'
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
import { useI18n } from '@/context/i18n-context'
import { getArtists } from '@/services/artists.service'
import { updateSong } from '@/services/song.service'
import type { Artist, SongWithArtist } from '@/types/app.types'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { Spinner } from './ui/spinner'

/**
 * Esquema de validación del formulario de edición utilizando Zod.
 * Define la estructura y las reglas de los datos del formulario.
 */
const formSchema = z.object({
  title: z.string().min(1, { message: 'El título es obligatorio.' }),
  artist_id: z.string().min(1, { message: 'El artista es obligatorio.' }),
  slug: z.string().optional(),
  lyrics: z.string().optional(),
  chords: z.string().optional(),
  video: z.string().optional(),
  coverArt: z.url({ message: 'Debe ser una URL válida.' })
})

/**
 * Formulario para que los administradores editen una canción existente.
 * @param {{ song: Song }} props - Propiedades con los datos de la canción a editar.
 * @returns {JSX.Element} El componente del formulario de edición.
 */
export function EditSongForm({ song }: { song: SongWithArtist }) {
  const { t } = useI18n()
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Inicialización de react-hook-form con el esquema de Zod y los valores por defecto de la canción.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: song.title ?? '',
      artist_id: song.artists.map((a) => a.name).join(', ') ?? '',
      slug: song.slug ?? '',
      lyrics: song.lyrics ?? '',
      chords: song.chords ?? '',
      video: song.video ?? '',
      coverArt: song.coverArt ?? ''
    }
  })

  useEffect(() => {
    getArtists().then(setArtists)
  }, [])

  /**
   * Función que se ejecuta al enviar el formulario.
   * @param {z.infer<typeof formSchema>} values - Los datos del formulario validados.
   */
  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    setIsLoading(true)

    const songData = {
      title: values.title,
      artist_id: values.artist_id,
      slug: values.slug,
      lyrics: values.lyrics,
      chords: values.chords,
      video: values.video,
      coverArt: values.coverArt
    }

    try {
      // Llama a la función del cliente para actualizar la canción en Supabase.
      await updateSong(song.id, songData)
      // Llama a la acción del servidor para revalidar rutas y redirigir.
      try {
        await revalidateAndRedirectAfterEdit(songData.slug || '')
      } catch (err) {
        console.error('Error en redirect:', err)
      }

      toast.success('La canción se ha actualizado correctamente')
    } catch (error) {
      if (
        error ||
        songData.artist_id === '' ||
        songData.artist_id === undefined ||
        songData.artist_id === null
      ) {
        console.error('Error al editar la canción: ', error)
        toast.error(t('songUpdateError'))
      }
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>{t('editSongTitle')}</CardTitle>
        <CardDescription>
          {t('editSongDescription', { title: song.title ?? '' })}
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
                    <FormLabel>{t('tableTitle')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='artist_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tableArtist')}</FormLabel>

                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccionar artista' />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Artistas</SelectLabel>
                            {artists.map((artist) => (
                              <SelectItem key={artist.id} value={artist.id}>
                                {artist.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                  <FormLabel>{t('chordsAndLyrics')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`
[Intro]

C G Am F

[Verse]

C            La
primera línea de la canción...
                      `}
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
                  <FormLabel>{t('lyricsOnly')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Solo la letra de la canción...'
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
                  <Spinner />
                  <p>{t('saving')}</p>
                </>
              ) : (
                t('saveChanges')
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
