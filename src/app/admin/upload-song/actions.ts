'use server';

import { revalidatePath } from 'next/cache';

/**
 * Acción de servidor que revalida varias rutas después de que un administrador sube una nueva canción.
 * Esto asegura que la nueva canción aparezca inmediatamente en todas las listas relevantes.
 * @param {string} artist - El nombre del artista de la canción subida. Se usa para revalidar la página específica del artista.
 */
export async function revalidateAfterSongUpload(artist: string) {
    // Revalida las rutas para mostrar listas actualizadas.
    // Esto limpia el caché de datos de estas páginas, forzando una recarga de datos frescos.
    revalidatePath('/'); // La página de inicio.
    revalidatePath('/artists'); // La página de lista de artistas.
    revalidatePath(`/artists/${encodeURIComponent(artist)}`); // La página específica del artista.
    revalidatePath('/sitemap.ts'); // El mapa del sitio para SEO.
    revalidatePath('/top-charts'); // La página de top canciones.
}
