'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateAfterLike(songId: string) {
    revalidatePath('/top-charts');
    revalidatePath(`/songs/${songId}`);
}
