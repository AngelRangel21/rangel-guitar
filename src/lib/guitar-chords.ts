import {
  type ChordQuality,
  chords,
  getChordSvg,
  getVariants,
  type VariantId
} from 'instruments-chords'
import { splitChordName } from '@/lib/chordpro'

// Sufijos de acorde → calidades de instruments-chords.
const SUFFIX_TO_QUALITY: Record<string, ChordQuality> = {
  '': 'major',
  M: 'major',
  m: 'minor',
  min: 'minor',
  '5': '5',
  '7': '7',
  maj7: 'maj7',
  M7: 'maj7',
  m7: 'm7',
  min7: 'm7',
  sus: 'sus4',
  sus4: 'sus4',
  sus2: 'sus2',
  add9: 'add9',
  '7sus': '7sus4',
  '7sus4': '7sus4',
  '7#9': '7#9',
  '9': '9',
  aug: 'aug',
  '+': 'aug',
  dim: 'dim',
  '°': 'dim',
  º: 'dim'
}

export interface GuitarChord {
  /** Raíz tal como la indexa instruments-chords (C, C#, D…). */
  root: string
  quality: ChordQuality
  /** Variantes disponibles, con la predeterminada primero. */
  variants: VariantId[]
}

/**
 * Resuelve un nombre de acorde (Bbm, E#, Am7/G…) a la raíz, calidad y
 * variantes de instruments-chords. Los acordes con bajo usan el acorde base.
 */
export function resolveGuitarChord(chordName: string): GuitarChord | null {
  const parts = splitChordName(chordName)
  if (!parts) return null
  const quality = SUFFIX_TO_QUALITY[parts.suffix]
  // Se lee `chords` porque la librería no expone la variante predeterminada
  // (`default`) con ninguna función.
  const definition = quality ? chords[parts.root]?.[quality] : undefined
  if (!quality || !definition) return null

  const ids = getVariants(parts.root, quality)
  const variants = [
    definition.default,
    ...ids.filter((id) => id !== definition.default)
  ].filter((id) => ids.includes(id))

  return variants.length > 0 ? { root: parts.root, quality, variants } : null
}

/** SVG del diagrama generado por instruments-chords. */
export function getGuitarChordSvg(
  chord: GuitarChord,
  variant: VariantId
): string | null {
  return getChordSvg(chord.root, chord.quality, variant)
}
