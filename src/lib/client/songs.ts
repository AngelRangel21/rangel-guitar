// IMPORTANT: This file is intended for client-side operations and does NOT have 'use server'.
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import type { Song } from '@/lib/types';

// Type for adding a new song, without the DB-generated fields
export type NewSongData = Omit<Song, 'id' | 'visitCount' | 'likeCount'>;

export async function addSong(songData: NewSongData): Promise<void> {
    // The slug is now the document ID. This ensures new songs are saved with the slug as their ID.
    const docRef = doc(db, 'songs', songData.slug);
    await setDoc(docRef, {
        ...songData,
        visitCount: 0,
        likeCount: 0,
    });
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
