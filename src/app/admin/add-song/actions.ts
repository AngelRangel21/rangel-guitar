'use server';

import { z } from 'zod';
import { addSong } from '@/lib/data';
import { deleteSongRequest } from '@/services/requests-service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Song } from '@/lib/types';

const addSongSchema = z.object({
    requestId: z.string(),
    title: z.string(),
    artist: z.string(),
    lyrics: z.string().optional(),
    chords: z.string().optional(),
    video: z.string().optional(),
    coverArt: z.string().url(),
});

export async function addSongAndRemoveRequest(data: z.infer<typeof addSongSchema>) {
    const validatedData = addSongSchema.safeParse(data);

    if (!validatedData.success) {
        throw new Error('Invalid data provided.');
    }

    const { requestId, ...songData } = validatedData.data;

    const songToAdd: Omit<Song, 'id'> = {
        title: songData.title,
        artist: songData.artist,
        lyrics: songData.lyrics,
        chords: songData.chords,
        video: songData.video,
        coverArt: songData.coverArt,
    };
    
    // Add the new song
    addSong(songToAdd);

    // Delete the request
    await deleteSongRequest(requestId);
    
    // Revalidate paths to show updated lists
    revalidatePath('/admin/requests');
    revalidatePath('/');
    revalidatePath('/artists');
    revalidatePath('/sitemap.ts');


    // Redirect to requests page
    redirect('/admin/requests');
}
