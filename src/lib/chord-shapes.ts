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
