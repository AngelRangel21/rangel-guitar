import { describe, expect, it } from 'vitest'
import { getGuitarChordSvg, resolveGuitarChord } from '@/lib/guitar-chords'

describe('resolveGuitarChord', () => {
  it('resuelve raíz, calidad y variantes (predeterminada primero)', () => {
    const chord = resolveGuitarChord('C')
    expect(chord?.root).toBe('C')
    expect(chord?.quality).toBe('major')
    expect(chord?.variants[0]).toBe('1')
    expect(chord?.variants.length).toBeGreaterThan(1)
  })

  it('normaliza bemoles y enarmónicos', () => {
    expect(resolveGuitarChord('Bbm')).toEqual(resolveGuitarChord('A#m'))
    expect(resolveGuitarChord('E#')?.root).toBe('F')
  })

  it('usa el acorde base para acordes con bajo', () => {
    expect(resolveGuitarChord('Am7/G')).toEqual(resolveGuitarChord('Am7'))
  })

  it('devuelve null si no hay datos', () => {
    expect(resolveGuitarChord('Cdim')).toBeNull()
    expect(resolveGuitarChord('Cxyz')).toBeNull()
    expect(resolveGuitarChord('Coro')).toBeNull()
  })
})

describe('getGuitarChordSvg', () => {
  it('genera el SVG con getChordSvg de instruments-chords', () => {
    const chord = resolveGuitarChord('G')
    if (!chord) throw new Error('G debería existir')
    const svg = getGuitarChordSvg(chord, chord.variants[0])
    expect(svg).toMatch(/^<svg[\s\S]*<\/svg>$/)
    expect(svg).toContain('<circle')
  })
})
