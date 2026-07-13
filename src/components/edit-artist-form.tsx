'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import {
  redirectAfterEdit,
  updateArtistAction
} from '@/app/[locale]/admin/artists/[slug]/edit/actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { FieldDescription } from '@/components/ui/field'
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
import { getArtistImage } from '@/services/artists.service'
import type { Artist } from '@/types/app.types'

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -/]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const formSchema = z.object({
  name: z.string().min(3, { message: 'El nombre es obligatorio' }),
  slug: z.string().min(3, { message: 'El slug es obligatorio' })
})

export function EditArtistForm({ artist }: { artist: Artist }) {
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(
    artist.image_url ? getArtistImage(artist.image_url) : null
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: artist.name,
      slug: artist.slug
    }
  })

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    form.setValue('name', value)
    if (value !== artist.name) {
      form.setValue('slug', slugify(value))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('id', artist.id)
      formData.append('name', values.name)
      formData.append('slug', values.slug)
      if (selectedFile) {
        formData.append('image', selectedFile)
      }

      await updateArtistAction(formData)
      try {
        await redirectAfterEdit()
      } catch {
        console.log('Redirecting...')
      }
      toast.success(`"${values.name}" ha sido actualizado con éxito.`)
    } catch (error) {
      console.error('Error al actualizar el artista:', error)
      toast.error('Error al actualizar el artista')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>Editar Artista</CardTitle>
        <CardDescription>
          Actualiza los datos de &quot;{artist.name}&quot;.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Artista</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Queen'
                        {...field}
                        onChange={handleNameChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug del Artista</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='queen'
                        {...field}
                        onChange={(e) =>
                          field.onChange(slugify(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className='md:col-span-2'>
                <FormLabel htmlFor='picture'>Imagen del Artista</FormLabel>
                <FormControl>
                  <Input
                    id='picture'
                    type='file'
                    accept='.webp, .jpg, .png, .avif'
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FieldDescription>
                  {preview
                    ? 'Selecciona una nueva imagen para reemplazar la actual.'
                    : 'Seleccionar la imagen del Artista.'}
                </FieldDescription>
              </FormItem>

              {preview && (
                <div className='md:col-span-2'>
                  <div className='relative size-32 rounded-xl overflow-hidden border-2 border-border'>
                    <Image
                      src={preview}
                      alt={artist.name}
                      fill
                      className='object-cover'
                      width={8}
                      height={8}
                    />
                  </div>
                </div>
              )}
            </div>

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? `${t('saving')}` : 'Guardar Cambios'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
