'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/context/i18n-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Song } from "@/lib/types";
import { updateSongWithSyncedLyrics } from "@/lib/client/songs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { synchronizeLyrics } from "@/ai/flows/lyric-synchronizer-flow";
import { Loader2 } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface SynchronizeSongFormProps {
    songs: Song[];
}

const formSchema = z.object({
  songId: z.string().min(1, { message: "Debes seleccionar una canción." }),
  audioFile: z
    .any()
    .refine((files) => files?.length === 1, 'Se requiere un archivo de audio.')
    .refine((files) => files?.[0]?.size <= 15 * 1024 * 1024, `El tamaño máximo del archivo es 15MB.`)
    .refine(
      (files) => ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/m4a'].includes(files?.[0]?.type),
      'Solo se aceptan archivos .mp3, .wav, .m4a y .ogg.'
    ),
});

export function SynchronizeSongForm({ songs }: SynchronizeSongFormProps) {
    const { t } = useI18n();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { songId: "" },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const selectedSong = songs.find(s => s.id === values.songId);
        if (!selectedSong || !selectedSong.chords) {
            toast({ variant: "destructive", title: "Error", description: "La canción seleccionada no tiene acordes para sincronizar." });
            setIsLoading(false);
            return;
        }

        const file = values.audioFile[0];

        try {
            // 1. Convert file to data URI for AI Flow
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async () => {
                const audioDataUri = reader.result as string;

                // 2. Call AI Flow
                const result = await synchronizeLyrics({ 
                    audioDataUri,
                    lyricsWithChords: selectedSong.chords!
                });

                if (!result || !result.timedLines) {
                    throw new Error("El análisis de la IA no devolvió un resultado válido.");
                }

                // 3. Upload audio file to Firebase Storage
                const storageRef = ref(storage, `song-audio/${selectedSong.id}/${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const audioUrl = await getDownloadURL(snapshot.ref);

                // 4. Update song document in Firestore
                await updateSongWithSyncedLyrics(selectedSong.id, result.timedLines, audioUrl);
                
                toast({
                    title: "Sincronización Completa",
                    description: `Los acordes de "${selectedSong.title}" han sido sincronizados.`,
                });
                form.reset();
            };

            reader.onerror = (error) => {
                throw new Error('Error al leer el archivo: ' + error);
            }

        } catch (error: any) {
            console.error("Synchronization failed:", error);
            toast({
                variant: "destructive",
                title: t('error'),
                description: "La sincronización falló: " + error.message,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>{t('synchronizeSong')}</CardTitle>
                <CardDescription>{t('synchronizeSongDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="songId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('selectSong')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('selectSongPlaceholder')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {songs.map(song => (
                                                <SelectItem key={song.id} value={song.id}>
                                                    {song.title} - {song.artist}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                          control={form.control}
                          name="audioFile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('audioFile')}</FormLabel>
                              <FormControl>
                                <Input 
                                  type="file" 
                                  accept="audio/mp3,audio/wav,audio/ogg,audio/m4a"
                                  onChange={(e) => field.onChange(e.target.files)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? t('synchronizing') : t('synchronizeSong')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
