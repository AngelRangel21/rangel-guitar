'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, increment } from 'firebase/firestore';
import type { Song } from '@/lib/types';

const songsCollection = collection(db, 'songs');

// Type for adding a new song, without the DB-generated fields
export type NewSongData = Omit<Song, 'id' | 'visitCount' | 'likeCount'>;

export async function getSongs(): Promise<Song[]> {
  const snapshot = await getDocs(query(songsCollection, orderBy('title', 'asc')));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
}

export async function getSongById(id: string): Promise<Song | null> {
  const docRef = doc(db, 'songs', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return null;
  }
  return { id: snapshot.id, ...snapshot.data() } as Song;
}

export async function getSongsByArtist(artistName: string): Promise<Song[]> {
    const q = query(songsCollection, where('artist', '==', artistName));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
}

export async function getArtists(): Promise<string[]> {
    const songs = await getSongs();
    const artists = new Set(songs.map(song => song.artist));
    return Array.from(artists).sort();
}

export async function addSong(songData: NewSongData): Promise<Song> {
    const docRef = await addDoc(songsCollection, {
        ...songData,
        visitCount: 0,
        likeCount: 0,
    });

    const newSong = {
        id: docRef.id,
        ...songData,
        visitCount: 0,
        likeCount: 0,
    };
    return newSong;
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

export async function getTopSongsBy(field: 'visitCount' | 'likeCount', count: number): Promise<Song[]> {
    const q = query(songsCollection, orderBy(field, 'desc'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
}
