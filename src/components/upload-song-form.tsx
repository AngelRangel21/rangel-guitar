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
import { useRouter } from 'next/navigation';
import { addSong, type NewSongData } from '@/lib/client/songs';
import { revalidateAfterSongUpload } from "@/app/admin/upload-song/actions";
import { createSlug } from "@/lib/utils";

/**
 * Esquema de validación del formulario para subir una canción, utilizando Zod.
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
 * Componente de formulario para que los administradores suban una nueva canción directamente.
 * @returns {JSX.Element} El formulario para subir canciones.
 */
export function UploadSongForm() {
    const { t } = useI18n();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Inicializa el formulario con react-hook-form y el resolver de Zod.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            artist: "",
            lyrics: "",
            chords: "",
            video: "",
            coverArt: "https://placehold.co/600x600.png",
        },
    });

    /**
     * Maneja el envío del formulario.
     * @param {z.infer<typeof formSchema>} values - Los datos del formulario validados.
     */
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const slug = createSlug(values.title, values.artist);
            const songToAdd: NewSongData = {
                title: values.title,
                artist: values.artist,
                slug: slug,
                lyrics: values.lyrics,
                chords: values.chords,
                video: values.video,
                coverArt: values.coverArt,
            };

            // Agrega la canción a la base de datos y revalida las rutas.
            await addSong(songToAdd);
            await revalidateAfterSongUpload(values.artist);

            toast({
                title: "Canción Subida",
                description: `"${values.title}" ha sido añadida a la biblioteca.`,
            });
            
            // Redirige al administrador a la página de la nueva canción.
            router.push(`/songs/${slug}`);

        } catch (error: any) {
             console.error("Upload song error:", error);
            toast({
                variant: "destructive",
                title: t('error'),
                description: t('uploadSongError'),
            });
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>{t('uploadSong')}</CardTitle>
                <CardDescription>{t('uploadSongDescription')}</CardDescription>
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
                                        <Textarea placeholder="[Intro]\nC G Am F\n\n[Verse]\nC\nLa primera línea de la canción..." rows={10} {...field} />
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
                                        <Textarea placeholder="La primera línea de la canción..." rows={10} {...field} />
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
                            {isLoading ? t('saving') + '...' : t('uploadSong')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
