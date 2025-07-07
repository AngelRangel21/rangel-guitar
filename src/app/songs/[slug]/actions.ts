'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Acción de servidor que se ejecuta después de eliminar una canción.
 * Revalida todas las rutas relevantes y redirige al usuario a la página de inicio.
 */
export async function revalidateAndRedirectAfterDelete() {
    // Invalida el caché de datos para las rutas afectadas para que reflejen la eliminación.
    revalidatePath('/'); // Página de inicio
    revalidatePath('/artists'); // Lista de artistas
    revalidatePath('/sitemap.ts'); // Mapa del sitio
    revalidatePath('/top-charts'); // Top de canciones
    
    // Redirige al usuario a la página de inicio.
    redirect('/');
}

/**
 * Acción de servidor que se ejecuta cuando un usuario visita una canción.
 * Revalida la página de "Top Canciones" para que el contador de visitas se actualice.
 */
export async function revalidateAfterVisit() {
    revalidatePath('/top-charts');
}
