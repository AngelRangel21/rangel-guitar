'use server';

import { getSongRequests, type SongRequest } from '@/services/requests-service';
import { revalidatePath } from 'next/cache';

export async function getAdminNotifications(): Promise<{
  count: number;
  recentRequests: SongRequest[];
}> {
  const requests = await getSongRequests();
  return {
    count: requests.length,
    recentRequests: requests.slice(0, 5), // Get top 5 recent
  };
}


export async function revalidateAfterRequestDelete(): Promise<{ success: boolean }> {
  try {
    revalidatePath('/admin/requests');
    return { success: true };
  } catch (error) {
    console.error('Failed to revalidate path:', error);
    return { success: false };
  }
}
