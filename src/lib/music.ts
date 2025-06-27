const notesSharp = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const notesFlat = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];

const getNoteIndex = (note: string): number => {
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
