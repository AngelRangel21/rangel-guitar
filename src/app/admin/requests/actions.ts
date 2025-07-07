'use server';

import { revalidatePath } from 'next/cache';

// La función `getAdminNotifications` ha sido eliminada porque causaba errores de permisos
// en el entorno de producción. Los datos de notificaciones ahora se obtienen directamente
// en el cliente usando un listener en tiempo real en el componente `Header.tsx`.

/**
 * Acción de servidor para revalidar la ruta de solicitudes de administrador.
 * Se llama después de que una solicitud es eliminada para asegurar que la lista se actualice.
 * @returns {Promise<{ success: boolean }>} Un objeto indicando si la revalidación fue exitosa.
 */
export async function revalidateAfterRequestDelete(): Promise<{ success: boolean }> {
  try {
    // Invalida el caché de la ruta '/admin/requests', forzando una recarga de datos frescos.
    revalidatePath('/admin/requests');
    return { success: true };
  } catch (error) {
    console.error('Failed to revalidate path:', error);
    return { success: false };
  }
}
