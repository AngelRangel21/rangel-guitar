'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/context/i18n-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { revalidateAndRedirectAfterEdit } from "@/app/songs/[slug]/edit/actions";
import type { Song } from "@/lib/types";
import { updateSong } from "@/lib/client/songs";
import { createSlug } from "@/lib/utils";

/**
 * Esquema de validación del formulario de edición utilizando Zod.
 * Define la estructura y las reglas de los datos del formulario.
 */
const formSchema = z.object({
    title: z.string().min(1, { message: "El título es obligatorio." }),
    artist: z.string().min(1, { message: "El artista es obligatorio." }),
    lyrics: z.string().optional(),
    chords: z.string().optional(),
    video: z.string().optional(),
    coverArt: z.string().url({ message: "Debe ser una URL válida." }),
});

/**
 * Formulario para que los administradores editen una canción existente.
 * @param {{ song: Song }} props - Propiedades con los datos de la canción a editar.
 * @returns {JSX.Element} El componente del formulario de edición.
 */
export function EditSongForm({ song }: { song: Song }) {
    const { t } = useI18n();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Inicialización de react-hook-form con el esquema de Zod y los valores por defecto de la canción.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: song.title,
            artist: song.artist,
            lyrics: song.lyrics || "",
            chords: song.chords || "",
            video: song.video || "",
            coverArt: song.coverArt,
        },
    });

    /**
     * Función que se ejecuta al enviar el formulario.
     * @param {z.infer<typeof formSchema>} values - Los datos del formulario validados.
     */
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const slug = createSlug(values.title, values.artist);
            const songData = {
                title: values.title,
                artist: values.artist,
                slug: slug,
                lyrics: values.lyrics,
                chords: values.chords,
                video: values.video,
                coverArt: values.coverArt,
            };

            // Llama a la función del cliente para actualizar la canción en Firestore.
            await updateSong(song.id, songData);
            // Llama a la acción del servidor para revalidar rutas y redirigir.
            await revalidateAndRedirectAfterEdit(slug, values.artist);
            
        } catch (error: any) {
            // La redirección de Next.js en una acción de servidor lanza un error, se debe capturar.
            if (error.digest?.startsWith('NEXT_REDIRECT')) {
                return;
            }
            console.error("Error al editar la cancion: ", error);
            toast({
                variant: "destructive",
                title: t('error'),
                description: t('songUpdateError'),
            });
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>{t('editSongTitle')}</CardTitle>
                <CardDescription>{t('editSongDescription', { title: song.title })}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="title"
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
                                name="artist"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tableArtist')}</FormLabel>
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
                            name="chords"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('chordsAndLyrics')}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="
                                        [Intro]

                                        C G Am F


                                        [Verse]

                                        C            La 
                                        primera línea de la canción...
                                        " rows={10} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lyrics"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('lyricsOnly')}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Solo la letra de la cancion..." rows={10} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="video"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ID del Video de YouTube (Opcional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="dQw4w9WgXcQ" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="coverArt"
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
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? t('saving') : t('saveChanges')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
