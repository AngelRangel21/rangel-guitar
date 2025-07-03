'use server';

import { updateLikeCount } from '@/services/songs-service';
import { revalidatePath } from 'next/cache';

export async function updateLikeCountAction(songId: string, delta: 1 | -1) {
    await updateLikeCount(songId, delta);
    revalidatePath('/top-charts');
    revalidatePath(`/songs/${songId}`);
}
