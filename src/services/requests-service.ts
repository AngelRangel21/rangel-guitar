'use server';

// Las operaciones de escritura y lectura del cliente se han movido a archivos específicos del cliente.
// Este archivo ahora solo contiene la lógica de lectura segura del servidor.

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, type Timestamp } from 'firebase/firestore';
import type { SongRequest } from '@/lib/types';


/**
 * Interfaz para los datos de entrada al crear una nueva solicitud de canción.
 */
export interface SongRequestInput {
  title: string;
  artist: string;
}

/**
 * Obtiene todas las solicitudes de canciones, ordenadas por fecha descendente.
 * ESTA FUNCIÓN ES PARA USO EXCLUSIVO DEL LADO DEL SERVIDOR (Server Components / Route Handlers)
 * porque asume que los permisos ya han sido validados.
 * @returns {Promise<SongRequest[]>} Una promesa que se resuelve con un array de solicitudes de canciones.
 */
export async function getSongRequestsForServer(): Promise<SongRequest[]> {
    const requestsCollection = collection(db, 'song-requests');
    const snapshot = await getDocs(query(requestsCollection, orderBy('requestedAt', 'desc')));
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            artist: data.artist,
            requestedAt: (data.requestedAt as Timestamp).toDate(), // Convierte el Timestamp de Firebase a un objeto Date de JS.
        };
    });
}
