// IMPORTANT: This file is intended for client-side operations and does NOT have 'use server'.
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

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
