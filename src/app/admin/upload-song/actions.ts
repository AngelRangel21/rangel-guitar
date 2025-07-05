'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateAfterSongUpload(artist: string) {
    // Revalidate paths to show updated lists
    revalidatePath('/');
    revalidatePath('/artists');
    revalidatePath(`/artists/${encodeURIComponent(artist)}`);
    revalidatePath('/sitemap.ts');
    revalidatePath('/top-charts');
}
