'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateAfterLike(songSlug: string) {
    revalidatePath('/top-charts');
    revalidatePath(`/songs/${songSlug}`);
}
