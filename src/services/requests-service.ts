'use server';

// This file now ONLY contains functions for READING data on the server.
// Write operations have been moved to a client-specific file.

export interface SongRequestInput {
  title: string;
  artist: string;
}

// `SongRequest` type is now in `src/lib/types.ts`
// `getSongRequests` has been removed because it cannot be called securely from a Server Component.
// Data fetching for requests is now handled on the client.
