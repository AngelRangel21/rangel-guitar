'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function revalidateAndRedirectAfterEdit(songSlug: string, artist: string) {
    revalidatePath(`/songs/${songSlug}`);
    revalidatePath(`/songs/${songSlug}/edit`);
    revalidatePath('/');
    revalidatePath('/artists');
    revalidatePath(`/artists/${encodeURIComponent(artist)}`);
    revalidatePath('/sitemap.ts');

    redirect(`/songs/${songSlug}`);
}
