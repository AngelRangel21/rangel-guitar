'use server';

import type { RequestSongInput } from '@/ai/flows/request-song-flow';

// In-memory store for song requests (for prototype purposes)
// In a real application, this would be a database.
let songRequests: (RequestSongInput & { requestedAt: Date })[] = [];

export async function addSongRequest(request: RequestSongInput): Promise<void> {
    songRequests.push({ ...request, requestedAt: new Date() });
}

export async function getSongRequests(): Promise<(RequestSongInput & { requestedAt: Date })[]> {
    // Return a copy to prevent mutation, sorted by most recent
    return [...songRequests].sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
}
