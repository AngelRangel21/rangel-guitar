// IMPORTANTE: Este archivo está destinado a operaciones del lado del cliente y NO debe tener la directiva 'use server'.
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { Artist } from '@/lib/types';

/**
 * Interfaz para los datos de un artista (sin el ID).
 */
export interface ArtistData {
  name: string;
  imageUrl: string;
}

// Referencia a la colección 'artists' en Firestore.
const artistsCollection = collection(db, 'artists');

/**
 * Agrega un nuevo artista a la base de datos.
 * @param {ArtistData} artistData - Los datos del artista.
 * @returns {Promise<Artist>} El objeto del artista recién creado con su ID.
 */
export async function addArtist(artistData: ArtistData): Promise<Artist> {
    const docRef = await addDoc(artistsCollection, {
        ...artistData,
        createdAt: serverTimestamp(),
    });
    return {
        id: docRef.id,
        ...artistData,
    };
}

/**
 * Actualiza los datos de un artista existente.
 * @param {string} id - El ID del artista a actualizar.
 * @param {Partial<ArtistData>} artistData - Los datos a actualizar.
 */
export async function updateArtist(id: string, artistData: Partial<ArtistData>): Promise<void> {
    const docRef = doc(db, 'artists', id);
    await updateDoc(docRef, {
        ...artistData,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Elimina un artista de la base de datos.
 * @param {string} id - El ID del artista a eliminar.
 */
export async function deleteArtist(id: string): Promise<void> {
    const docRef = doc(db, 'artists', id);
    await deleteDoc(docRef);
}
