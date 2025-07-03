'use server';

import { updateLikeCount } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export async function updateLikeCountAction(songId: number, delta: 1 | -1) {
    updateLikeCount(songId, delta);
    revalidatePath('/top-charts');
}
