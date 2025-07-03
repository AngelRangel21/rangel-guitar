'use server';

import { deleteSong, incrementVisitCount } from '@/services/songs-service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteSongAction(id: string) {
    try {
        await deleteSong(id);
        revalidatePath('/');
        revalidatePath('/artists');
        revalidatePath('/sitemap.ts');
        revalidatePath('/top-charts');
        // We can't know the artist name here to revalidate their specific page,
        // so we rely on the generic revalidations above.
    } catch (error) {
        console.error('Failed to delete song:', error);
        throw new Error('Song not found for deletion.');
    }

    redirect('/');
}

export async function incrementVisitCountAction(id: string) {
    await incrementVisitCount(id);
    revalidatePath('/top-charts');
}
