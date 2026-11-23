import * as z from 'zod'

export const MAX_STARS = 5

/** Valoración válida: entero de 1 a 5 (igual que el CHECK de la base). */
export const ratingSchema = z.number().int().min(1).max(MAX_STARS)

export function isValidRating(value: number): boolean {
  return ratingSchema.safeParse(value).success
}

/** Índices de las estrellas: [1, 2, 3, 4, 5]. */
export const STAR_VALUES = Array.from(
  { length: MAX_STARS },
  (_, index) => index + 1
)

/**
 * Parte rellena (0 a 1) de la estrella `star` para una media dada.
 * Ej.: con 3.4, la estrella 4 queda rellena al 40 %.
 */
export function getStarFill(average: number, star: number): number {
  return Math.min(Math.max(average - (star - 1), 0), 1)
}
