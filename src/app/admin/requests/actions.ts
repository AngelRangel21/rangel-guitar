'use server';

import { getSongRequests, type SongRequest, deleteSongRequest } from '@/services/requests-service';
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


export async function deleteRequestAction(id: string): Promise<{ success: boolean }> {
  try {
    await deleteSongRequest(id);
    revalidatePath('/admin/requests');
    // The header polls for new data, so it will update automatically.
    // We can return a success status to the client.
    return { success: true };
  } catch (error) {
    console.error('Failed to delete song request:', error);
    return { success: false };
  }
}
