'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';
import type { Song } from '@/lib/types';

// This file now ONLY contains functions for READING data on the server.
// Write operations have been moved to a client-specific file.

const songsCollection = collection(db, 'songs');

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

export async function getTopSongsBy(field: 'visitCount' | 'likeCount', count: number): Promise<Song[]> {
    const q = query(songsCollection, orderBy(field, 'desc'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
}
