'use server';

import { getSongRequests, type SongRequest } from '@/services/requests-service';

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
