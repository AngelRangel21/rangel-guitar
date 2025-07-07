'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Acción de servidor que se ejecuta después de editar una canción.
 * Revalida todas las rutas afectadas y redirige al usuario a la página de la canción recién editada.
 * @param {string} songSlug - El slug de la canción editada para la redirección.
 * @param {string} artist - El nombre del artista para revalidar su página específica.
 */
export async function revalidateAndRedirectAfterEdit(songSlug:string, artist: string) {
    // Invalida el caché de datos de las páginas afectadas para mostrar la información actualizada.
    revalidatePath(`/songs/${songSlug}`); // La página de la canción
    revalidatePath(`/songs/${songSlug}/edit`); // La página de edición (aunque se redirige desde ella)
    revalidatePath('/'); // Página de inicio
    revalidatePath('/artists'); // Lista de artistas
    revalidatePath(`/artists/${encodeURIComponent(artist)}`); // Página del artista
    revalidatePath('/sitemap.ts'); // Mapa del sitio

    // Redirige al usuario a la página de la canción que acaba de editar.
    redirect(`/songs/${songSlug}`);
}
