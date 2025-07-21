
'use server';

import { revalidatePath } from 'next/cache';

/**
 * Revalida todas las rutas relacionadas con los artistas después de una mutación.
 * Esto asegura que las listas de artistas y sus páginas individuales se actualicen en todo el sitio.
 */
export async function revalidateArtists() {
    revalidatePath('/artists');
    revalidatePath('/admin/artists');
    // Dado que no sabemos qué página de artista individual necesita ser revalidada,
    // es más sencillo revalidar la ruta general. Next.js gestionará la actualización.
}
