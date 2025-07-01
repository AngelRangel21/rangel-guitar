
'use server';

import { z } from 'zod';
import { addSong } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Song } from '@/lib/types';

const uploadSongSchema = z.object({
    title: z.string().min(1, "El título es obligatorio."),
    artist: z.string().min(1, "El artista es obligatorio."),
    lyrics: z.string().optional(),
    chords: z.string().optional(),
    video: z.string().optional(),
    coverArt: z.string().url("Debe ser una URL válida."),
});

export async function uploadSongAction(data: z.infer<typeof uploadSongSchema>) {
    const validatedData = uploadSongSchema.safeParse(data);

    if (!validatedData.success) {
        throw new Error('Invalid data provided.');
    }

    const songToAdd: Omit<Song, 'id'> = {
        title: validatedData.data.title,
        artist: validatedData.data.artist,
        lyrics: validatedData.data.lyrics,
        chords: validatedData.data.chords,
        video: validatedData.data.video,
        coverArt: validatedData.data.coverArt,
    };

    const newSong = addSong(songToAdd);

    // Revalidate paths to show updated lists
    revalidatePath('/');
    revalidatePath('/artists');
    revalidatePath(`/artists/${encodeURIComponent(newSong.artist)}`);
    revalidatePath('/sitemap.ts');

    // Redirect to the newly created song page
    redirect(`/songs/${newSong.id}`);
}
