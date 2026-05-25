'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { uploadArtistAction } from '@/app/[locale]/admin/upload-artist/actions'
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

// Función limpia para la generación automática de slugs
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

export function UploadArtistForm() {
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: ''
    }
  })

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    form.setValue('name', value)
    form.setValue('slug', slugify(value))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedFile) {
      toast.error('Por favor selecciona una imagen para el artista.')
      return
    }

    setIsLoading(true)

    try {
      // Empaquetamos todo en FormData para cruzar la frontera Cliente -> Servidor
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('slug', values.slug)
      formData.append('image', selectedFile)

      // Ejecutamos la acción segura del lado del servidor
      const result = await uploadArtistAction(formData)

      if (result?.success) {
        toast.success(`"${values.name}" ha sido añadido con éxito.`)

        // Reseteo impecable de la UI
        form.reset()
        setSelectedFile(null)
        const fileInput = document.getElementById('picture') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    } catch (error) {
      console.error('Error al subir el artista:', error)
      toast.error('Error al subir el artista')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>Subir Artista</CardTitle>
        <CardDescription>
          Añade una nueva canción a la biblioteca directamente.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* NAME */}
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

              {/* SLUG */}
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

              {/* IMAGE */}
              <FormItem className='md:col-span-2'>
                <FormLabel htmlFor='picture'>Imagen del Artista</FormLabel>
                <FormControl>
                  <Input
                    id='picture'
                    type='file'
                    accept='.webp, .jpg, .png, .avif'
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                  />
                </FormControl>
                <FieldDescription>
                  Seleccionar la imagen del Artista.
                </FieldDescription>
              </FormItem>
            </div>

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? `${t('saving')}` : 'Subir Artista'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
