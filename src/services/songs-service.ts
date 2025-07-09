
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';
import type { Song } from '@/lib/types';

/**
 * Crea un "slug" a partir del título y el artista de una canción.
 * Un slug es una versión amigable para URL del nombre.
 * @param {string} title - El título de la canción.
 * @param {string} artist - El artista de la canción.
 * @returns {string} - El slug generado.
 */
const createSlug = (title: string, artist: string): string => {
    const combined = `${title} ${artist}`;
    return combined.toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
};

// Referencia a la colección 'songs' en Firestore.
const songsCollection = collection(db, 'songs');

/**
 * Mapea un documento de Firestore a un objeto Song, generando el slug si no existe.
 * @param {any} doc - El documento de Firestore.
 * @returns {Song} - El objeto canción.
 */
const mapDocToSong = (doc: any): Song => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        slug: data.slug || createSlug(data.title, data.artist), // Genera el slug si no está en la base de datos.
    } as Song;
};

/**
 * Obtiene todas las canciones de la base de datos, ordenadas por título.
 * @returns {Promise<Song[]>} - Un array con todas las canciones.
 */
export async function getSongs(): Promise<Song[]> {
  const snapshot = await getDocs(query(songsCollection, orderBy('title', 'asc')));
  return snapshot.docs.map(mapDocToSong);
}

/**
 * Busca una canción por su slug de forma eficiente.
 * @param {string} slug - El slug de la canción a buscar.
 * @returns {Promise<Song | null>} - La canción encontrada o null si no existe.
 */
export async function getSongBySlug(slug: string): Promise<Song | null> {
    // Consulta directamente por el campo 'slug' para mayor eficiencia.
    const q = query(songsCollection, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return null;
    }
    
    // Devuelve la primera canción encontrada que coincida con el slug.
    return mapDocToSong(snapshot.docs[0]);
}

/**
 * Obtiene una canción por su ID de documento.
 * @param {string} id - El ID de la canción.
 * @returns {Promise<Song | null>} - La canción encontrada o null.
 */
export async function getSongById(id: string): Promise<Song | null> {
  const docRef = doc(db, 'songs', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return null;
  }
  return mapDocToSong(snapshot);
}

/**
 * Obtiene todas las canciones de un artista específico.
 * @param {string} artistName - El nombre del artista.
 * @returns {Promise<Song[]>} - Un array con las canciones del artista.
 */
export async function getSongsByArtist(artistName: string): Promise<Song[]> {
    const q = query(songsCollection, where('artist', '==', artistName));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToSong);
}

/**
 * Obtiene una lista única de todos los artistas.
 * @returns {Promise<string[]>} - Un array con los nombres de todos los artistas, ordenado alfabéticamente.
 */
export async function getArtists(): Promise<string[]> {
    const songs = await getSongs();
    const artists = new Set(songs.map(song => song.artist));
    return Array.from(artists).sort();
}

/**
 * Obtiene las canciones más populares según un campo específico (visitas o "me gusta").
 * @param {'visitCount' | 'likeCount'} field - El campo por el cual ordenar.
 * @param {number} count - El número de canciones a obtener.
 * @returns {Promise<Song[]>} - Un array con las canciones más populares.
 */
export async function getTopSongsBy(field: 'visitCount' | 'likeCount', count: number): Promise<Song[]> {
    const q = query(songsCollection, orderBy(field, 'desc'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToSong);
}
