/**
 * Define la estructura de un único nivel del juego de entrenamiento de oído.
 */
export interface Level {
    name: string; // El nombre o número del nivel (ej. "1", "2").
    notes: string[]; // El conjunto de notas posibles que pueden aparecer en este nivel.
    notesToGuess: number; // La cantidad de aciertos necesarios para pasar el nivel.
}

/**
 * Define la estructura de una categoría de dificultad, que contiene varios subniveles.
 */
export interface Difficulty {
    name: 'beginner' | 'intermediate' | 'advanced'; // Nombre de la categoría de dificultad.
    subLevels: Level[]; // Array de niveles dentro de esta dificultad.
}

/**
 * Array que contiene toda la estructura de niveles y dificultades del juego.
 */
export const levels: Difficulty[] = [
    {
        name: 'beginner',
        subLevels: [
            { name: '1', notes: ['C', 'G'], notesToGuess: 5 },
            { name: '2', notes: ['C', 'E', 'G'], notesToGuess: 7 },
            { name: '3', notes: ['C', 'D', 'E'], notesToGuess: 8 },
            { name: '4', notes: ['F', 'A', 'C'], notesToGuess: 8 },
        ]
    },
    {
        name: 'intermediate',
        subLevels: [
            { name: '5', notes: ['C', 'D', 'E', 'F', 'G'], notesToGuess: 10 },
            { name: '6', notes: ['G', 'A', 'B', 'C', 'D'], notesToGuess: 10 },
            { name: '7', notes: ['C', 'E', 'G', 'B'], notesToGuess: 12 },
            { name: '8', notes: ['C', 'C#', 'D'], notesToGuess: 12 },
        ]
    },
    {
        name: 'advanced',
        subLevels: [
            { name: '9', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], notesToGuess: 15 },
            { name: '10', notes: ['F#', 'G#', 'A#', 'B', 'C#'], notesToGuess: 15 },
            { name: '11', notes: ['C', 'D#', 'F#', 'A'], notesToGuess: 15 },
            { name: '12', notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], notesToGuess: 20 },
        ]
    }
];
