import { ChordProParser, Key, Transposer } from '@chordproject/parser'

/** Notas raíz ofrecidas como tonalidad destino en el selector. */
export const TARGET_KEYS = [
  'C',
  'C#',
  'D',
  'Eb',
  'E',
  'F',
  'F#',
  'G',
  'Ab',
  'A',
  'Bb',
  'B'
] as const

/**
 * Resuelve la tonalidad original de una canción para mostrarla en el control
 * de transposición.
 *
 * Prioriza el campo `key` de la base de datos; si está vacío, lee la metadata
 * `{key: ...}` de la hoja ChordPro y, como último recurso, infiere la tonalidad
 * a partir de los acordes de la canción.
 */
export function getOriginalKey(
  chordSheet: string,
  key?: string | null
): string | null {
  const keyFromField = key?.trim()
  if (keyFromField) return keyFromField

  try {
    const song = new ChordProParser().parse(chordSheet ?? '')
    return (song.key ?? song.getPossibleKey())?.toString() ?? null
  } catch {
    return null
  }
}

/**
 * Transpone una tonalidad usando el mismo motor que la hoja de acordes, para
 * que la etiqueta mostrada coincida con los acordes reales de la canción
 * (por ejemplo, `C` + 3 = `Eb`, no `D#`).
 */
export function transposeKey(key: string, amount: number): string {
  if (!key || amount === 0) return key

  const parsedKey = Key.parse(key)
  if (parsedKey == null) return key

  const song = new ChordProParser().parse(`[${key}]`)
  song.key = parsedKey

  const direction = amount > 0 ? 'up' : 'down'
  let transposed = song
  for (let i = 0; i < Math.abs(amount); i++) {
    transposed = Transposer.transpose(transposed, direction)
  }

  return transposed.key?.toString() ?? key
}
