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
import { addSongAndRemoveRequest } from "@/app/admin/add-song/actions";

interface AddSongFormProps {
    requestId: string;
    initialTitle: string;
    initialArtist: string;
}

const formSchema = z.object({
    title: z.string().min(1, { message: "El título es obligatorio." }),
    artist: z.string().min(1, { message: "El artista es obligatorio." }),
    lyrics: z.string().optional(),
    chords: z.string().optional(),
    video: z.string().optional(),
    coverArt: z.string().url({ message: "Debe ser una URL válida." }),
});

export function AddSongForm({ requestId, initialTitle, initialArtist }: AddSongFormProps) {
    const { t } = useI18n();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialTitle,
            artist: initialArtist,
            lyrics: "",
            chords: "",
            video: "",
            coverArt: "https://placehold.co/400x400.png",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await addSongAndRemoveRequest({ ...values, requestId });
            toast({
                title: "Canción Agregada",
                description: `"${values.title}" se ha añadido a la biblioteca y la solicitud ha sido eliminada.`,
            });
            // The action will handle redirection
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo agregar la canción. Intenta de nuevo.",
            });
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Agregar Nueva Canción</CardTitle>
                <CardDescription>Completa los detalles de la canción solicitada.</CardDescription>
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
                                name="artist"
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
                            name="chords"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Acordes y Letra</FormLabel>
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
                                    <FormLabel>Solo Letra</FormLabel>
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
                            {isLoading ? "Agregando..." : "Agregar Canción y Completar Solicitud"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
