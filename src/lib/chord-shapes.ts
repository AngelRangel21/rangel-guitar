export type ChordShape = (number | 'x')[]; // 'x' for muted, number for fret

export interface ChordShapes {
  [key: string]: {
    positions: ChordShape;
    fingering?: ChordShape; // Optional: which finger to use
    baseFret?: number;
  };
}

// Data for common chords. 'x' = muted, 0 = open. Order is EADGBe
export const guitarChordShapes: ChordShapes = {
  // Major Chords
  'A': { positions: ['x', 0, 2, 2, 2, 0] },
  'A#': { positions: ['x', 1, 3, 3, 3, 1], baseFret: 1 },
  'B': { positions: ['x', 2, 4, 4, 4, 2], baseFret: 2 },
  'C': { positions: ['x', 3, 2, 0, 1, 0] },
  'C#': { positions: ['x', 4, 3, 1, 2, 1], baseFret: 1 },
  'D': { positions: ['x', 'x', 0, 2, 3, 2] },
  'D#': { positions: ['x', 'x', 1, 3, 4, 3], baseFret: 1 },
  'E': { positions: [0, 2, 2, 1, 0, 0] },
  'F': { positions: [1, 3, 3, 2, 1, 1], baseFret: 1 },
  'F#': { positions: [2, 4, 4, 3, 2, 2], baseFret: 2 },
  'G': { positions: [3, 2, 0, 0, 0, 3] },
  'G#': { positions: [4, 6, 6, 5, 4, 4], baseFret: 4 },

  // Minor Chords
  'Am': { positions: ['x', 0, 2, 2, 1, 0] },
  'A#m': { positions: ['x', 1, 3, 3, 2, 1], baseFret: 1 },
  'Bm': { positions: ['x', 2, 4, 4, 3, 2], baseFret: 2 },
  'Cm': { positions: ['x', 3, 5, 5, 4, 3], baseFret: 3 },
  'C#m': { positions: ['x', 4, 6, 6, 5, 4], baseFret: 4 },
  'Dm': { positions: ['x', 'x', 0, 2, 3, 1] },
  'D#m': { positions: ['x', 'x', 1, 3, 4, 2], baseFret: 1 },
  'Em': { positions: [0, 2, 2, 0, 0, 0] },
  'Fm': { positions: [1, 3, 3, 1, 1, 1], baseFret: 1 },
  'F#m': { positions: [2, 4, 4, 2, 2, 2], baseFret: 2 },
  'Gm': { positions: [3, 5, 5, 3, 3, 3], baseFret: 3 },
  'G#m': { positions: [4, 6, 6, 4, 4, 4], baseFret: 4 },

  // Seventh Chords
  'A7': { positions: ['x', 0, 2, 0, 2, 0] },
  'A#7': { positions: ['x', 1, 3, 1, 3, 1], baseFret: 1 },
  'B7': { positions: ['x', 2, 1, 2, 0, 2] },
  'C7': { positions: ['x', 3, 2, 3, 1, 0] },
  'C#7': { positions: ['x', 4, 3, 4, 2, 4], baseFret: 2 },
  'D7': { positions: ['x', 'x', 0, 2, 1, 2] },
  'D#7': { positions: ['x', 'x', 1, 3, 2, 3], baseFret: 1 },
  'E7': { positions: [0, 2, 0, 1, 0, 0] },
  'F7': { positions: [1, 3, 1, 2, 1, 1], baseFret: 1 },
  'F#7': { positions: [2, 4, 2, 3, 2, 2], baseFret: 2 },
  'G7': { positions: [3, 2, 0, 0, 0, 1] },
  'G#7': { positions: [4, 6, 4, 5, 4, 4], baseFret: 4 },
};


export interface KeyboardChordNotes {
  [key: string]: string[];
}

// Notes in each chord for keyboard. Includes enharmonic equivalents.
export const keyboardChordNotes: KeyboardChordNotes = {
  // Major
  'A': ['A', 'C#', 'E'],
  'A#': ['A#', 'D', 'F'], 'Bb': ['Bb', 'D', 'F'],
  'B': ['B', 'D#', 'F#'],
  'C': ['C', 'E', 'G'],
  'C#': ['C#', 'F', 'G#'], 'Db': ['Db', 'F', 'Ab'],
  'D': ['D', 'F#', 'A'],
  'D#': ['D#', 'G', 'A#'], 'Eb': ['Eb', 'G', 'Bb'],
  'E': ['E', 'G#', 'B'],
  'F': ['F', 'A', 'C'],
  'F#': ['F#', 'A#', 'C#'], 'Gb': ['Gb', 'Bb', 'Db'],
  'G': ['G', 'B', 'D'],
  'G#': ['G#', 'C', 'D#'], 'Ab': ['Ab', 'C', 'Eb'],

  // Minor
  'Am': ['A', 'C', 'E'],
  'A#m': ['A#', 'C#', 'F'], 'Bbm': ['Bb', 'Db', 'F'],
  'Bm': ['B', 'D', 'F#'],
  'Cm': ['C', 'Eb', 'G'],
  'C#m': ['C#', 'E', 'G#'], 'Dbm': ['Db', 'E', 'Ab'],
  'Dm': ['D', 'F', 'A'],
  'D#m': ['D#', 'F#', 'A#'], 'Ebm': ['Eb', 'Gb', 'Bb'],
  'Em': ['E', 'G', 'B'],
  'Fm': ['F', 'Ab', 'C'],
  'F#m': ['F#', 'A', 'C#'], 'Gbm': ['Gb', 'A', 'Db'],
  'Gm': ['G', 'Bb', 'D'],
  'G#m': ['G#', 'B', 'D#'], 'Abm': ['Ab', 'B', 'Eb'],

  // 7th
  'A7': ['A', 'C#', 'E', 'G'],
  'A#7': ['A#', 'D', 'F', 'G#'], 'Bb7': ['Bb', 'D', 'F', 'Ab'],
  'B7': ['B', 'D#', 'F#', 'A'],
  'C7': ['C', 'E', 'G', 'Bb'],
  'C#7': ['C#', 'F', 'G#', 'B'], 'Db7': ['Db', 'F', 'Ab', 'B'],
  'D7': ['D', 'F#', 'A', 'C'],
  'D#7': ['D#', 'G', 'A#', 'C#'], 'Eb7': ['Eb', 'G', 'Bb', 'Db'],
  'E7': ['E', 'G#', 'B', 'D'],
  'F7': ['F', 'A', 'C', 'Eb'],
  'F#7': ['F#', 'A#', 'C#', 'E'], 'Gb7': ['Gb', 'Bb', 'Db', 'E'], // E is enharmonic of Fb
  'G7': ['G', 'B', 'D', 'F'],
  'G#7': ['G#', 'C', 'D#', 'F#'], 'Ab7': ['Ab', 'C', 'Eb', 'Gb'],
};
