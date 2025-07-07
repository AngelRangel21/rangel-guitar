import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Función de utilidad para combinar clases de Tailwind CSS de forma segura.
 * Evita conflictos entre clases (ej. `p-2` y `p-4`) y permite lógica condicional.
 * @param {...ClassValue} inputs - Una secuencia de clases CSS.
 * @returns {string} - La cadena de clases combinada.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Crea un "slug" a partir del título y el artista de una canción.
 * Un slug es una versión amigable para URL del nombre (todo en minúsculas, sin espacios ni caracteres especiales).
 * @param {string} title - El título de la canción.
 * @param {string} artist - El artista de la canción.
 * @returns {string} - El slug generado.
 */
export const createSlug = (title: string, artist: string): string => {
    const combined = `${title} ${artist}`;
    return combined.toLowerCase()
        .replace(/&/g, 'and') // Reemplaza '&' por 'and'.
        .replace(/[^a-z0-9\s-]/g, '') // Elimina caracteres no alfanuméricos (excepto espacios y guiones).
        .trim() // Elimina espacios al principio y al final.
        .replace(/\s+/g, '-'); // Reemplaza espacios por guiones.
};
