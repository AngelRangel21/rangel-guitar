'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function revalidateAndRedirectAfterEdit(songId: string, artist: string) {
    revalidatePath(`/songs/${songId}`);
    revalidatePath(`/songs/${songId}/edit`);
    revalidatePath('/');
    revalidatePath('/artists');
    revalidatePath(`/artists/${encodeURIComponent(artist)}`);
    revalidatePath('/sitemap.ts');

    redirect(`/songs/${songId}`);
}
