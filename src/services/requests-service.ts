'use server';

import type { RequestSongInput } from '@/ai/flows/request-song-flow';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, deleteDoc, query, orderBy, serverTimestamp, type Timestamp } from 'firebase/firestore';

export interface SongRequest extends RequestSongInput {
  id: string;
  requestedAt: Date;
}

interface FirestoreSongRequest extends RequestSongInput {
    requestedAt: Timestamp;
}

const requestsCollection = collection(db, 'song-requests');


export async function addSongRequest(request: RequestSongInput): Promise<void> {
    await addDoc(requestsCollection, {
        ...request,
        requestedAt: serverTimestamp(),
    });
}

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

export async function deleteSongRequest(id: string): Promise<void> {
    const docRef = doc(db, 'song-requests', id);
    await deleteDoc(docRef);
}
