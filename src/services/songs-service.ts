
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';
import type { Song } from '@/lib/types';

const createSlug = (title: string, artist: string) => {
    const combined = `${title} ${artist}`;
    return combined.toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
};

const songsCollection = collection(db, 'songs');

const mapDocToSong = (doc: any): Song => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        slug: data.slug || createSlug(data.title, data.artist),
    } as Song;
};

export async function getSongs(): Promise<Song[]> {
  const snapshot = await getDocs(query(songsCollection, orderBy('title', 'asc')));
  return snapshot.docs.map(mapDocToSong);
}

/**
 * Finds a song by its slug.
 * This function fetches all songs and filters them in memory.
 * This approach is used to correctly find songs that may not have the `slug` field
 * persisted in the database yet (legacy data), as the slug is generated on-the-fly
 * in `mapDocToSong`. For larger datasets, a database migration to add slugs to all
 * documents and a direct query would be more performant.
 */
export async function getSongBySlug(slug: string): Promise<Song | null> {
    const allSongs = await getSongs();
    const song = allSongs.find(s => s.slug === slug);
    return song || null;
}

export async function getSongById(id: string): Promise<Song | null> {
  const docRef = doc(db, 'songs', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return null;
  }
  return mapDocToSong(snapshot);
}

export async function getSongsByArtist(artistName: string): Promise<Song[]> {
    const q = query(songsCollection, where('artist', '==', artistName));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToSong);
}

export async function getArtists(): Promise<string[]> {
    const songs = await getSongs();
    const artists = new Set(songs.map(song => song.artist));
    return Array.from(artists).sort();
}

export async function getTopSongsBy(field: 'visitCount' | 'likeCount', count: number): Promise<Song[]> {
    const q = query(songsCollection, orderBy(field, 'desc'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToSong);
}
