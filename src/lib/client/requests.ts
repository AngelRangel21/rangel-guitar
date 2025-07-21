// IMPORTANTE: Este archivo está destinado a operaciones del lado del cliente y NO debe tener la directiva 'use server'.
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, deleteDoc, serverTimestamp, getDocs, query, orderBy, type Timestamp } from 'firebase/firestore';

/**
 * Interfaz para los datos de entrada de una nueva solicitud de canción.
 */
export interface SongRequestInput {
  title: string;
  artist: string;
}

// Referencia a la colección 'song-requests' en Firestore.
const requestsCollection = collection(db, 'song-requests');

/**
 * Agrega una nueva solicitud de canción a la base de datos.
 * @param {SongRequestInput} request - Los datos de la solicitud.
 */
export async function addSongRequest(request: SongRequestInput): Promise<void> {
    await addDoc(requestsCollection, {
        ...request,
        requestedAt: serverTimestamp(), // Usa la marca de tiempo del servidor para la fecha de solicitud.
    });
}

/**
 * Elimina una solicitud de canción de la base de datos por su ID.
 * @param {string} id - El ID del documento de la solicitud a eliminar.
 */
export async function deleteSongRequest(id: string): Promise<void> {
    const docRef = doc(db, 'song-requests', id);
    await deleteDoc(docRef);
}
