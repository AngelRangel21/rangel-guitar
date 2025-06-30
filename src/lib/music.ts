export const notesSharp = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const notesFlat = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];

export const getNoteIndex = (note: string): number => {
  const sharpIndex = notesSharp.indexOf(note);
  if (sharpIndex !== -1) return sharpIndex;
  
  const flatIndex = notesFlat.indexOf(note);
  if (flatIndex !== -1) return flatIndex;

  // Handle cases like 'Cb' or 'E#' if needed, but for now we'll keep it simple
  if (note === 'B#') return notesSharp.indexOf('C');
  if (note === 'Cb') return notesSharp.indexOf('B');
  if (note === 'E#') return notesSharp.indexOf('F');
  if (note === 'Fb') return notesSharp.indexOf('E');
  
  return -1;
};

export const transposeChord = (chord: string, amount: number): string => {
  if (!chord || amount === 0) {
    return chord;
  }
  
  const chordRegex = /^([A-G][b#]?)(\S*)/;
  const match = chord.match(chordRegex);

  if (!match) {
    return chord; 
  }

  const [, root, rest] = match;
  const rootIndex = getNoteIndex(root);
  
  if (rootIndex === -1) {
    return chord;
  }

  const newIndex = (rootIndex + amount) % 12;
  const transposedIndex = newIndex < 0 ? newIndex + 12 : newIndex;
  
  const newRoot = notesSharp[transposedIndex];

  return newRoot + rest;
};

const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11]; // In semitones from the root
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10]; // Natural minor

export const getScaleNotes = (rootNote: string, scaleType: 'major' | 'minor'): string[] => {
    const rootIndex = getNoteIndex(rootNote);
    if (rootIndex === -1) {
        return [];
    }

    const intervals = scaleType === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
    
    // For scales, it's often better to start with the standard chromatic scale from C
    const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const startingNoteIndex = chromaticScale.indexOf(rootNote);
     if (startingNoteIndex === -1) {
        // Fallback for flat names if needed, though our rootNotes are sharp
        const flatChromatic = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        const flatIndex = flatChromatic.indexOf(rootNote);
        if(flatIndex === -1) return [];
        
        // Re-map to sharp scale for consistency
        return getScaleNotes(chromaticScale[flatIndex], scaleType);
    }
    
    return intervals.map(interval => {
        const noteIndex = (startingNoteIndex + interval) % 12;
        return chromaticScale[noteIndex];
    });
};
