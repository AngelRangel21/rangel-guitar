'use server';

// Este archivo AHORA SOLO contiene funciones para LEER datos en el servidor.
// Las operaciones de escritura se han movido a un archivo específico del cliente.

/**
 * Interfaz para los datos de entrada al crear una nueva solicitud de canción.
 */
export interface SongRequestInput {
  title: string;
  artist: string;
}

// El tipo `SongRequest` ahora está en `src/lib/types.ts`.
// La función `getSongRequests` ha sido eliminada porque no se puede llamar de forma segura
// desde un Server Component debido a las reglas de seguridad de Firestore que requieren
// autenticación del usuario. La obtención de datos para las solicitudes ahora se maneja en el cliente.
