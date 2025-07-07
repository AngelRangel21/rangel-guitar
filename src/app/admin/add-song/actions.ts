'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Acción de servidor que revalida varias rutas y redirige al usuario.
 * Se utiliza después de agregar una nueva canción para asegurar que todas las
 * listas y páginas relevantes se actualicen con la nueva información.
 * @param {string} artist - El nombre del artista de la canción agregada para revalidar su página específica.
 */
export async function revalidateAndRedirect(artist: string) {
    // Revalida las rutas para mostrar listas actualizadas.
    // Esto limpia el caché de datos para estas páginas, forzando una recarga de datos frescos.
    revalidatePath('/admin/requests'); // La lista de solicitudes.
    revalidatePath('/'); // La página de inicio.
    revalidatePath('/artists'); // La lista de artistas.
    revalidatePath(`/artists/${encodeURIComponent(artist)}`); // La página del artista específico.
    revalidatePath('/sitemap.ts'); // El mapa del sitio.
    revalidatePath('/top-charts'); // La página de top canciones.

    // Redirige al usuario a la página de solicitudes.
    redirect('/admin/requests');
}
