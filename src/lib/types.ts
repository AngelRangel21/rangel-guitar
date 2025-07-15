/**
 * Define la estructura de una línea de letra sincronizada.
 */
export type TimedLine = {
  line: string;
  startTime: number;
  endTime: number;
}

/**
 * Define la estructura de un objeto Canción (Song) en la aplicación.
 */
export type Song = {
  id: string; // ID del documento en Firestore.
  slug: string; // Versión del título y artista para usar en URLs, también es el ID.
  title: string;
  artist: string;
  coverArt: string; // URL de la imagen de portada.
  lyrics?: string; // Letra sin acordes.
  chords?: string; // Letra con acordes.
  video?: string; // ID del video de YouTube.
  visitCount: number; // Contador de visitas.
  likeCount: number; // Contador de "me gusta".
  timedLines?: TimedLine[]; // Array de líneas sincronizadas.
  audioUrl?: string; // URL al archivo de audio en Firebase Storage.
};

/**
 * Define la estructura de un objeto Solicitud de Canción (SongRequest).
 */
export interface SongRequest {
  id: string; // ID del documento en Firestore.
  title: string;
  artist: string;
  requestedAt: Date; // Fecha en que se realizó la solicitud.
}
