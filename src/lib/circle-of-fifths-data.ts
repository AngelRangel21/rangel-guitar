
// Este archivo define los datos para el Círculo de Quintas.
// Cada objeto en el array representa un segmento del círculo,
// conteniendo la tonalidad mayor y su relativa menor.
// El orden sigue el ciclo de quintas ascendentes (añadiendo sostenidos).

export const circleOfFifthsKeys = [
  { major: 'C', minor: 'Am' },    // 0 sostenidos/bemoles
  { major: 'G', minor: 'Em' },    // 1 sostenido
  { major: 'D', minor: 'Bm' },    // 2 sostenidos
  { major: 'A', minor: 'F#m' },   // 3 sostenidos
  { major: 'E', minor: 'C#m' },   // 4 sostenidos
  { major: 'B', minor: 'G#m' },   // 5 sostenidos
  { major: 'F#/Gb', minor: 'D#m' }, // 6 sostenidos / 6 bemoles
  { major: 'C#/Db', minor: 'Bbm' }, // 5 bemoles
  { major: 'G#/Ab', minor: 'Fm' },  // 4 bemoles
  { major: 'D#/Eb', minor: 'Cm' },  // 3 bemoles
  { major: 'A#/Bb', minor: 'Gm' },  // 2 bemoles
  { major: 'F', minor: 'Dm' },    // 1 bemol
];
