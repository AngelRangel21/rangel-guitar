'use server';

import type { RequestSongInput } from '@/ai/flows/request-song-flow';

export interface SongRequest extends RequestSongInput {
  id: string;
  requestedAt: Date;
}

// In-memory store for song requests (for prototype purposes).
// We attach the store to the `global` object to prevent it from being cleared
// by Next.js's Hot Module Replacement (HMR) in development.
// In a real application, this would be a database.
declare global {
  // We use `var` to declare a global variable.
  // eslint-disable-next-line no-var
  var __songRequests: SongRequest[] | undefined;
}

let songRequests: SongRequest[];

if (process.env.NODE_ENV === 'production') {
  songRequests = [];
} else {
  if (!global.__songRequests) {
    global.__songRequests = [];
  }
  songRequests = global.__songRequests;
}


export async function addSongRequest(request: RequestSongInput): Promise<void> {
    const newRequest: SongRequest = {
        ...request,
        id: Date.now().toString(),
        requestedAt: new Date(),
    };
    songRequests.push(newRequest);
}

export async function getSongRequests(): Promise<SongRequest[]> {
    // Return a copy to prevent mutation, sorted by most recent
    return [...songRequests].sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
}

export async function deleteSongRequest(id: string): Promise<void> {
    const index = songRequests.findIndex(req => req.id === id);
    if (index > -1) {
        songRequests.splice(index, 1);
    }
}
