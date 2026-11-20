import {
  ChordProParser,
  MusicTheoryHelper,
  type Song,
  Transposer
} from '@chordproject/parser'

/** Máximo de semitonos que se puede transponer hacia arriba o hacia abajo. */
export const MAX_TRANSPOSE = 11

// Raíz + sufijo válido de acorde + bajo opcional. Sirve para distinguir
// acordes reales ([Am], [C/E]) de encabezados de sección ([Coro], [Bridge]).
const CHORD_REGEX =
  /^([A-G][#b]?)((?:maj|min|dim|aug|sus|add|m|M|[0-9]|[#b+\-()º°ø])*)(?:\/([A-G][#b]?))?$/

const LEADING_TOKEN_REGEX = /^\s*\[([^\]]+)\]\s*(.*)$/

export function isChordName(value: string): boolean {
  return CHORD_REGEX.test(value.trim())
}

/**
 * En ChordPro, `[Coro]` es un acorde (C + "oro"). Las canciones guardadas usan
 * esa notación para secciones, así que las convertimos a `{comment: Coro}`
 * para que la librería no las transponga ni las muestre como acordes.
 */
export function normalizeSectionHeaders(chordSheet: string): string {
  return chordSheet
    .split('\n')
    .flatMap((line) => {
      const match = line.match(LEADING_TOKEN_REGEX)
      if (!match) return [line]
      const [, token, rest] = match
      if (isChordName(token)) return [line]
      const comment = `{comment: ${token.trim()}}`
      return rest.trim() === '' ? [comment] : [comment, rest]
    })
    .join('\n')
}

function hasKeyDirective(chordSheet: string): boolean {
  return /^\s*\{\s*key\s*:/im.test(chordSheet)
}

/**
 * Parsea la cifra con @chordproject/parser. Si la canción tiene tonalidad en
 * la base de datos y la cifra no trae `{key: ...}`, se agrega para que la
 * transposición use esa tonalidad como contexto.
 */
export function parseChordSheet(
  chordSheet: string | null | undefined,
  originalKey?: string | null
): Song {
  let source = normalizeSectionHeaders(chordSheet ?? '')
  const key = originalKey?.trim()
  if (key && isChordName(key) && !hasKeyDirective(source)) {
    source = `{key: ${key}}\n${source}`
  }
  return new ChordProParser().parse(source)
}

/** Transpone la canción `steps` semitonos (limitado a ±MAX_TRANSPOSE). */
export function transposeSong(song: Song, steps: number): Song {
  const clamped = Math.max(-MAX_TRANSPOSE, Math.min(MAX_TRANSPOSE, steps))
  const direction = clamped > 0 ? 'up' : 'down'
  let result = song
  for (let i = 0; i < Math.abs(clamped); i++) {
    result = Transposer.transpose(result, direction)
  }
  return result
}

/** Nombre de una nota en la forma que usan los diagramas (C, C#, Eb…). */
export function toCommonNoteName(note: string): string {
  const pitchClass = MusicTheoryHelper.pitchClassMap[note]
  return pitchClass === undefined
    ? note
    : MusicTheoryHelper.reversePitchClassMap[pitchClass]
}

const SHARP_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B'
]

export interface ChordParts {
  /** Raíz normalizada a sostenidos (C, C#, D…), como la usan los diagramas. */
  root: string
  suffix: string
  bass: string | null
}

/**
 * Separa un acorde en raíz, sufijo y bajo. La librería puede escribir E#, Cb,
 * Db… según la tonalidad; la raíz se normaliza a sostenidos (E#m/G → F + m).
 */
export function splitChordName(chordName: string): ChordParts | null {
  const match = chordName.trim().match(CHORD_REGEX)
  if (!match) return null
  const [, root, suffix, bass] = match
  const pitchClass = MusicTheoryHelper.pitchClassMap[root]
  if (pitchClass === undefined) return null
  return { root: SHARP_NAMES[pitchClass], suffix, bass: bass ?? null }
}

/** Notas del acorde para el diagrama de teclado. */
export function getKeyboardChordNotes(chordName: string): string[] {
  const base = chordName.trim().split('/')[0]
  return MusicTheoryHelper.getChordTones(base).map(toCommonNoteName)
}
