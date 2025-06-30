'use server';

import { z } from 'zod';
import { updateSong } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const editSongSchema = z.object({
    id: z.number(),
    title: z.string().min(1, "El título es obligatorio."),
    artist: z.string().min(1, "El artista es obligatorio."),
    lyrics: z.string().optional(),
    chords: z.string().optional(),
    video: z.string().optional(),
    coverArt: z.string().url("Debe ser una URL válida."),
});

export async function updateSongAction(data: z.infer<typeof editSongSchema>) {
    const validatedData = editSongSchema.safeParse(data);

    if (!validatedData.success) {
        throw new Error('Invalid data provided.');
    }

    const { id, ...songData } = validatedData.data;
    
    updateSong(id, songData);
    
    revalidatePath(`/songs/${id}`);
    revalidatePath(`/songs/${id}/edit`);
    revalidatePath('/');
    revalidatePath('/artists');
    revalidatePath(`/artists/${encodeURIComponent(songData.artist)}`);
    revalidatePath('/sitemap.ts');

    redirect(`/songs/${id}`);
}
