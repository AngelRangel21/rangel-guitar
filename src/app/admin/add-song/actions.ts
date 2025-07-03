'use server';

import { z } from 'zod';
import { addSong } from '@/services/songs-service';
import { deleteSongRequest } from '@/services/requests-service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
    
    // Add the new song
    const newSong = await addSong(songData);

    // Delete the request
    await deleteSongRequest(requestId);
    
    // Revalidate paths to show updated lists
    revalidatePath('/admin/requests');
    revalidatePath('/');
    revalidatePath('/artists');
    revalidatePath(`/artists/${encodeURIComponent(newSong.artist)}`);
    revalidatePath('/sitemap.ts');
    revalidatePath('/top-charts');


    // Redirect to requests page
    redirect('/admin/requests');
}
