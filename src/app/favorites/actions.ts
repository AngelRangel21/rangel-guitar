'use server';

import { revalidatePath } from 'next/cache';

/**
 * Acción de servidor para revalidar rutas después de que un usuario da "me gusta" a una canción.
 * Esto asegura que la página de "Top Canciones" y la página de la canción reflejen el nuevo recuento de "me gusta".
 * @param {string} songSlug - El slug de la canción a la que se le dio "me gusta".
 */
export async function revalidateAfterLike(songSlug: string) {
    // Invalida el caché de la página de "Top Canciones".
    revalidatePath('/top-charts');
    // Invalida el caché de la página específica de la canción.
    revalidatePath(`/songs/${songSlug}`);
}
