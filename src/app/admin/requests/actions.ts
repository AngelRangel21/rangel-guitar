'use server';

import type { RequestSongInput } from '@/ai/flows/request-song-flow';
import { getSongRequests } from '@/services/requests-service';

export async function getAdminNotifications(): Promise<{
  count: number;
  recentRequests: (RequestSongInput & { requestedAt: Date })[];
}> {
  const requests = await getSongRequests();
  return {
    count: requests.length,
    recentRequests: requests.slice(0, 5), // Get top 5 recent
  };
}
