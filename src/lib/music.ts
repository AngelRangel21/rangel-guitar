// Define las notas en la escala cromática usando sostenidos.
export const notesSharp = [
  'A',
  'A#',
  'B',
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#'
]
// Define las notas en la escala cromática usando bemoles.
const notesFlat = [
  'A',
  'Bb',
  'B',
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab'
]

/**
 * Obtiene el índice numérico (0-11) de una nota musical.
 * Maneja tanto sostenidos como bemoles.
 * @param {string} note - La nota a buscar (ej. 'C#', 'Db').
 * @returns {number} - El índice de la nota, o -1 si no se encuentra.
 */
export const getNoteIndex = (note: string): number => {
  const sharpIndex = notesSharp.indexOf(note)
  if (sharpIndex !== -1) return sharpIndex

  const flatIndex = notesFlat.indexOf(note)
  if (flatIndex !== -1) return flatIndex

  // Maneja casos enarmónicos especiales (no estándar).
  if (note === 'B#') return notesSharp.indexOf('C')
  if (note === 'Cb') return notesSharp.indexOf('B')
  if (note === 'E#') return notesSharp.indexOf('F')
  if (note === 'Fb') return notesSharp.indexOf('E')

  return -1
}

// Intervalos en semitonos desde la raíz para escalas mayores y menores.
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11]
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10] // Natural minor

/**
 * Calcula las notas de una escala mayor o menor a partir de una nota raíz.
 * @param {string} rootNote - La nota raíz de la escala.
 * @param {'major' | 'minor'} scaleType - El tipo de escala.
 * @returns {string[]} - Un array con las notas de la escala.
 */
export const getScaleNotes = (
  rootNote: string,
  scaleType: 'major' | 'minor'
): string[] => {
  const rootIndex = getNoteIndex(rootNote)
  if (rootIndex === -1) {
    return []
  }

  const intervals =
    scaleType === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS

  // Escala cromática de referencia (usando sostenidos).
  const chromaticScale = [
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
  const startingNoteIndex = chromaticScale.indexOf(rootNote)
  if (startingNoteIndex === -1) {
    // Fallback para notas raíz bemoles, convirtiéndolas a su equivalente sostenido.
    const flatChromatic = [
      'C',
      'Db',
      'D',
      'Eb',
      'E',
      'F',
      'Gb',
      'G',
      'Ab',
      'A',
      'Bb',
      'B'
    ]
    const flatIndex = flatChromatic.indexOf(rootNote)
    if (flatIndex === -1) return []

    return getScaleNotes(chromaticScale[flatIndex], scaleType)
  }

  // Calcula cada nota de la escala aplicando los intervalos a la nota raíz.
  return intervals.map((interval) => {
    const noteIndex = (startingNoteIndex + interval) % 12
    return chromaticScale[noteIndex]
  })
}
