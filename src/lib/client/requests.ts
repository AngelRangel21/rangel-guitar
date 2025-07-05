// IMPORTANT: This file is intended for client-side operations and does NOT have 'use server'.
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, deleteDoc, serverTimestamp, getDocs, query, orderBy, type Timestamp } from 'firebase/firestore';
import type { SongRequest } from '@/lib/types';

export interface SongRequestInput {
  title: string;
  artist: string;
}

const requestsCollection = collection(db, 'song-requests');

export async function addSongRequest(request: SongRequestInput): Promise<void> {
    await addDoc(requestsCollection, {
        ...request,
        requestedAt: serverTimestamp(),
    });
}

export async function deleteSongRequest(id: string): Promise<void> {
    const docRef = doc(db, 'song-requests', id);
    await deleteDoc(docRef);
}

export async function getSongRequests(): Promise<SongRequest[]> {
    const snapshot = await getDocs(query(requestsCollection, orderBy('requestedAt', 'desc')));
    return snapshot.docs.map(doc => {
        const data = doc.data() as { title: string; artist: string; requestedAt: Timestamp };
        return {
            id: doc.id,
            title: data.title,
            artist: data.artist,
            requestedAt: data.requestedAt.toDate(),
        };
    });
}
