'use server';

import type { RequestSongInput } from '@/ai/flows/request-song-flow';

// In-memory store for song requests (for prototype purposes).
// We attach the store to the `global` object to prevent it from being cleared
// by Next.js's Hot Module Replacement (HMR) in development.
// In a real application, this would be a database.

declare global {
  // We use `var` to declare a global variable.
  // eslint-disable-next-line no-var
  var __songRequests: (RequestSongInput & { requestedAt: Date })[] | undefined;
}

let songRequests: (RequestSongInput & { requestedAt: Date })[];

if (process.env.NODE_ENV === 'production') {
  songRequests = [];
} else {
  if (!global.__songRequests) {
    global.__songRequests = [];
  }
  songRequests = global.__songRequests;
}


export async function addSongRequest(request: RequestSongInput): Promise<void> {
    songRequests.push({ ...request, requestedAt: new Date() });
}

export async function getSongRequests(): Promise<(RequestSongInput & { requestedAt: Date })[]> {
    // Return a copy to prevent mutation, sorted by most recent
    return [...songRequests].sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
}
