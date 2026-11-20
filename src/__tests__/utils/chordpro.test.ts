import { describe, expect, it } from 'vitest'
import {
  getKeyboardChordNotes,
  MAX_TRANSPOSE,
  normalizeSectionHeaders,
  parseChordSheet,
  splitChordName,
  transposeSong
} from '@/lib/chordpro'

const chordsOf = (sheet: string, key: string | null, steps: number) => {
  const song = transposeSong(parseChordSheet(sheet, key), steps)
  return {
    key: song.key?.toString() ?? null,
    chords: song.sections.flatMap((section) =>
      section.lines.flatMap((line) =>
        'pairs' in line
          ? (line as { pairs: { chord?: { toString(): string } }[] }).pairs
              .filter((pair) => pair.chord)
              .map((pair) => String(pair.chord))
          : []
      )
    )
  }
}

describe('normalizeSectionHeaders', () => {
  it('convierte encabezados de sección en comentarios', () => {
    expect(normalizeSectionHeaders('[Coro]\n[C]Hola\n[Intro] [G] [D]')).toBe(
      '{comment: Coro}\n[C]Hola\n{comment: Intro}\n[G] [D]'
    )
  })

  it('no toca acordes sueltos', () => {
    expect(normalizeSectionHeaders('[Am]\n[C/E]')).toBe('[Am]\n[C/E]')
  })
})

describe('transposeSong', () => {
  it('usa la tonalidad de la BD como contexto', () => {
    const result = chordsOf('[F]a [Bb]b [C7]c [Dm]d', 'F', 3)
    expect(result.key).toBe('Ab')
    expect(result.chords).toEqual(['Ab', 'Db', 'Eb7', 'Fm'])
  })

  it('transpone el bajo y no transpone secciones', () => {
    const result = chordsOf('[Coro]\n[G]a [D/F#]b', 'G', 2)
    expect(result.chords).toEqual(['A', 'E/G#'])
  })

  it('limita la transposición a ±MAX_TRANSPOSE', () => {
    const song = parseChordSheet('[C]a', 'C')
    expect(transposeSong(song, 20).key?.toString()).toBe(
      transposeSong(song, MAX_TRANSPOSE).key?.toString()
    )
  })

  it('no transpone si steps es 0', () => {
    expect(chordsOf('[C]a [G]b', 'C', 0).chords).toEqual(['C', 'G'])
  })
})

describe('diagramas', () => {
  it('separa y normaliza el acorde', () => {
    expect(splitChordName('E#m/G')).toEqual({
      root: 'F',
      suffix: 'm',
      bass: 'G'
    })
    expect(splitChordName('Coro')).toBeNull()
  })

  it('calcula las notas de teclado con la librería', () => {
    expect(getKeyboardChordNotes('C#')).toEqual(['C#', 'F', 'Ab'])
    expect(getKeyboardChordNotes('Am7/G')).toEqual(['A', 'C', 'E', 'G'])
  })
})
