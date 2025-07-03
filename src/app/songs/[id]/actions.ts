'use server';

import { deleteSong, incrementVisitCount } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteSongAction(id: number) {
    const success = deleteSong(id);

    if (success) {
        revalidatePath('/');
        revalidatePath('/artists');
        revalidatePath('/sitemap.ts');
        revalidatePath('/top-charts');
        // We can't know the artist name here to revalidate their specific page,
        // so we rely on the generic revalidations above.
    } else {
        throw new Error('Song not found for deletion.');
    }

    redirect('/');
}

export async function incrementVisitCountAction(id: number) {
    incrementVisitCount(id);
    revalidatePath('/top-charts');
}
