// IMPORTANTE: Este archivo está destinado a operaciones del lado del cliente y NO debe tener la directiva 'use server'.
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import type { Song } from '@/lib/types';

// Tipo para agregar una nueva canción, sin los campos generados por la base de datos (id, contadores).
export type NewSongData = Omit<Song, 'id' | 'visitCount' | 'likeCount'>;

/**
 * Agrega una nueva canción a la base de datos.
 * @param {NewSongData} songData - Los datos de la nueva canción.
 */
export async function addSong(songData: NewSongData): Promise<void> {
    // El slug ahora es el ID del documento. Esto asegura que nuevas canciones se guarden con el slug como su ID.
    const docRef = doc(db, 'songs', songData.slug);
    await setDoc(docRef, {
        ...songData,
        visitCount: 0, // Inicializa los contadores.
        likeCount: 0,
    });
}

/**
 * Actualiza los datos de una canción existente en la base de datos.
 * @param {string} id - El ID de la canción a actualizar.
 * @param {Partial<NewSongData>} songData - Los campos de la canción a actualizar.
 */
export async function updateSong(id: string, songData: Partial<NewSongData>): Promise<void> {
    const docRef = doc(db, 'songs', id);
    await updateDoc(docRef, songData);
}

/**
 * Elimina una canción de la base de datos por su ID.
 * @param {string} id - El ID de la canción a eliminar.
 */
export async function deleteSong(id: string): Promise<void> {
    const docRef = doc(db, 'songs', id);
    await deleteDoc(docRef);
}

/**
 * Incrementa el contador de visitas de una canción en 1.
 * @param {string} id - El ID de la canción visitada.
 */
export async function incrementVisitCount(id: string): Promise<void> {
    const docRef = doc(db, 'songs', id);
    await updateDoc(docRef, {
        visitCount: increment(1) // Utiliza la función `increment` atómica de Firestore.
    });
}

/**
 * Actualiza el contador de "me gusta" de una canción.
 * @param {string} id - El ID de la canción.
 * @param {1 | -1} delta - El valor a sumar (1 para "me gusta", -1 para "no me gusta").
 */
export async function updateLikeCount(id: string, delta: 1 | -1): Promise<void> {
    const docRef = doc(db, 'songs', id);
    await updateDoc(docRef, {
        likeCount: increment(delta) // Utiliza la función `increment` atómica de Firestore.
    });
}
