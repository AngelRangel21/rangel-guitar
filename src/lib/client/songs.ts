// IMPORTANT: This file is intended for client-side operations and does NOT have 'use server'.
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, increment, type DocumentReference } from 'firebase/firestore';
import type { Song } from '@/lib/types';

// Type for adding a new song, without the DB-generated fields
export type NewSongData = Omit<Song, 'id' | 'visitCount' | 'likeCount'>;
const songsCollection = collection(db, 'songs');

export async function addSong(songData: NewSongData): Promise<DocumentReference> {
    const docRef = await addDoc(songsCollection, {
        ...songData,
        visitCount: 0,
        likeCount: 0,
    });
    return docRef;
}

export async function updateSong(id: string, songData: Partial<NewSongData>): Promise<void> {
    const docRef = doc(db, 'songs', id);
    await updateDoc(docRef, songData);
}

export async function deleteSong(id: string): Promise<void> {
    const docRef = doc(db, 'songs', id);
    await deleteDoc(docRef);
}

export async function incrementVisitCount(id: string): Promise<void> {
    const docRef = doc(db, 'songs', id);
    await updateDoc(docRef, {
        visitCount: increment(1)
    });
}

export async function updateLikeCount(id: string, delta: 1 | -1): Promise<void> {
    const docRef = doc(db, 'songs', id);
    await updateDoc(docRef, {
        likeCount: increment(delta)
    });
}
