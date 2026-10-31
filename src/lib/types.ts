/**
 * Define la estructura de un objeto Solicitud de Canción (SongRequest).
 */
export interface SongRequest {
  id: string // ID del documento en Firestore.
  title: string
  artist: string
  requestedAt: Date // Fecha en que se realizó la solicitud.
}
