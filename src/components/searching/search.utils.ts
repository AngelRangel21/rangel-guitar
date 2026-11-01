// Utilidades compartidas por el buscador (cliente y servidor).

/** Longitud mínima para lanzar una búsqueda. */
export const MIN_QUERY_LENGTH = 2

/** Longitud máxima del término, para no generar URLs ni filtros enormes. */
export const MAX_QUERY_LENGTH = 80

/**
 * Normaliza el término de búsqueda: quita espacios sobrantes y descarta los
 * términos demasiado cortos (misma regla que usa la UI).
 */
export function normalizeQuery(raw: string | null | undefined): string {
  const value = (raw ?? '').trim().slice(0, MAX_QUERY_LENGTH)
  return value.length >= MIN_QUERY_LENGTH ? value : ''
}

/**
 * Limpia los metacaracteres que PostgREST interpreta en un filtro `.or(...)`
 * (comas y paréntesis) y los comodines de `like` (`%` y `_`).
 *
 * El término llega desde la URL, así que sin esto un valor como
 * `rock,id.gt.0` podría alterar la consulta en lugar de buscar ese texto.
 */
export function sanitizeTerm(term: string): string {
  return term
    .replace(/[,()"'\\%_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_QUERY_LENGTH)
}
