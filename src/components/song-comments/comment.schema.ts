import * as z from 'zod'

/** Límite de la columna `song_comments.content` (CHECK en la base de datos). */
export const COMMENT_MAX_LENGTH = 1000

/** Texto de un comentario: sin espacios sobrantes, entre 1 y 1000 caracteres. */
export const commentContentSchema = z
  .string()
  .trim()
  .min(1)
  .max(COMMENT_MAX_LENGTH)

/** Indica si el texto se puede publicar. */
export function isValidComment(content: string): boolean {
  return commentContentSchema.safeParse(content).success
}

/** Considera editado un comentario si cambió más de 1 s después de crearse. */
export function isEditedComment(createdAt: string, updatedAt: string): boolean {
  return new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 1000
}

/** Iniciales para el avatar de respaldo (máximo 2 letras). */
export function getInitials(name: string | null | undefined): string {
  const words = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}
