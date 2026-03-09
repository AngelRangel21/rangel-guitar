'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import React, { useState, useEffect } from "react"

import { useI18n } from "@/context/i18n-context"
import { createSlug } from "@/lib/utils"
import { toast } from "sonner"

import { addSong } from "@/services/song.service"
import { getArtists } from "@/services/artists.service"

import { revalidateAndRedirectAfterUpload } from "@/app/admin/upload-song/actions"

import type { Artist } from "@/types/app.types"
import { redirect } from "next/navigation"



const formSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio." }),
  artist_id: z.string().min(1, { message: "El artista es obligatorio." }),
  lyrics: z.string().optional(),
  chords: z.string().optional(),
  video: z.string().optional(),
  coverArt: z.string().url({ message: "Debe ser una URL válida." }),
})



export function UploadSongForm() {

  const { t } = useI18n()

  const [isLoading, setIsLoading] = useState(false)
  const [artists, setArtists] = useState<Artist[]>([])



  useEffect(() => {
    async function loadArtists() {
      try {
        const data = await getArtists()
        setArtists(data)
      } catch (error) {
        console.error("Error cargando artistas", error)
      }
    }

    loadArtists()
  }, [])



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      title: "",
      artist_id: "",
      lyrics: "",
      chords: "",
      video: "",
      coverArt: "https://placehold.co/600x600.png",
    },
  })



  async function onSubmit(values: z.infer<typeof formSchema>) {

    setIsLoading(true)

    try {

      const artist = artists.find(a => a.id === values.artist_id)

      const slug = createSlug(values.title)

      const songToAdd = {
        title: values.title,
        artist_id: values.artist_id,
        slug,
        lyrics: values.lyrics ?? '',
        chords: values.chords ?? '',
        video: values.video ?? '',
        coverArt: values.coverArt,
      }

      await addSong(songToAdd)

      try {
        await revalidateAndRedirectAfterUpload(
          artist?.name ?? "",
          slug
        )
      } catch (err) {
        console.error("Error en redirect:", err)
      }

      toast.success(`"${values.title}" ha sido añadida a la biblioteca.`)
      

    } catch (error) {
      console.error("Error al subir la canción:", error)
      toast.error(t("uploadSongError"))
    } finally {
      setIsLoading(false)
    }

  }



  const ID_YOUTUBE =
    "https://img.youtube.com/vi/ID_YOUTUBE/maxresdefault.jpg"



  return (

    <Card className="w-full max-w-2xl">

      <CardHeader>
        <CardTitle>{t("uploadSong")}</CardTitle>
        <CardDescription>
          {t("uploadSongDescription")}
        </CardDescription>
      </CardHeader>



      <CardContent>

        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >



            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* TITLE */}

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("tableTitle")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              {/* ARTIST */}

              <FormField
                control={form.control}
                name="artist_id"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>{t("tableArtist")}</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >

                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un artista" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Artistas</SelectLabel>

                          {artists.map((artist) => (
                            <SelectItem
                              key={artist.id}
                              value={artist.id}
                            >
                              {artist.name}
                            </SelectItem>
                          ))}

                        </SelectGroup>
                      </SelectContent>

                    </Select>

                    <FormMessage />

                  </FormItem>
                )}
              />

            </div>



            {/* CHORDS */}

            <FormField
              control={form.control}
              name="chords"
              render={({ field }) => (
                <FormItem>

                  <FormLabel>
                    {t("chordsAndLyrics")}
                  </FormLabel>

                  <FormControl>

                    <Textarea
                      rows={14}
                      placeholder={`
[Intro]
C G Am F

[Verse]
C            G
La primera línea...
`}
                      {...field}
                    />

                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />



            {/* LYRICS */}

            <FormField
              control={form.control}
              name="lyrics"
              render={({ field }) => (
                <FormItem>

                  <FormLabel>{t("lyricsOnly")}</FormLabel>

                  <FormControl>
                    <Textarea
                      rows={10}
                      placeholder="La primera línea de la canción..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />



            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* VIDEO */}

              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>
                      ID del Video de YouTube
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="dQw4w9WgXcQ"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />



              {/* COVER */}

              <FormField
                control={form.control}
                name="coverArt"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>
                      URL de la portada
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder={ID_YOUTUBE}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />

            </div>



            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >

              {isLoading
                ? t("saving") + "..."
                : t("uploadSong")}

            </Button>

          </form>

        </Form>

      </CardContent>

    </Card>
  )
}