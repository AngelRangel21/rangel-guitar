'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, type Timestamp } from 'firebase/firestore';

// This file now ONLY contains functions for READING data on the server.
// Write operations have been moved to a client-specific file.

export interface SongRequestInput {
  title: string;
  artist: string;
}
export interface SongRequest extends SongRequestInput {
  id: string;
  requestedAt: Date;
}

interface FirestoreSongRequest extends SongRequestInput {
    requestedAt: Timestamp;
}

const requestsCollection = collection(db, 'song-requests');

export async function getSongRequests(): Promise<SongRequest[]> {
    const snapshot = await getDocs(query(requestsCollection, orderBy('requestedAt', 'desc')));
    return snapshot.docs.map(doc => {
        const data = doc.data() as FirestoreSongRequest;
        return {
            id: doc.id,
            title: data.title,
            artist: data.artist,
            requestedAt: data.requestedAt.toDate(),
        };
    });
}
