import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Propiedades que el componente KeyboardChordDiagram espera recibir.
 */
interface KeyboardChordDiagramProps {
  notes: string[]; // Las notas que componen el acorde o escala.
  className?: string; // Clases CSS adicionales.
}

// Definición de las teclas y notas del teclado.
const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const ALL_NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ALL_NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Dimensiones para el renderizado del SVG.
const KEY_WIDTH = 20;
const KEY_HEIGHT = 100;
const BLACK_KEY_WIDTH = 12;
const BLACK_KEY_HEIGHT = 65;

/**
 * Componente que renderiza un diagrama de teclado de piano/órgano
 * y resalta las notas de un acorde o escala específicos.
 * @param {KeyboardChordDiagramProps} props - Propiedades del componente.
 * @returns {JSX.Element} El diagrama del teclado en SVG.
 */
export function KeyboardChordDiagram({ notes, className }: KeyboardChordDiagramProps) {
  // Crea un Set con las notas a resaltar para una búsqueda eficiente.
  // Normaliza las notas bemoles a sus equivalentes sostenidos para consistencia.
  const notesToHighlight = new Set(notes.map(note => {
    const flatIndex = ALL_NOTES_FLAT.indexOf(note);
    return flatIndex !== -1 ? ALL_NOTES_SHARP[flatIndex] : note;
  }));

  const keyboardKeys = [];
  const totalWhiteKeys = 14; // Renderiza dos octavas de teclas blancas.

  // Dibuja primero las teclas blancas.
  for (let i = 0; i < totalWhiteKeys; i++) {
    const keyName = WHITE_KEYS[i % 7];
    const isHighlighted = notesToHighlight.has(keyName);

    keyboardKeys.push(
      <rect
        key={`white-${i}`}
        x={i * KEY_WIDTH}
        y="0"
        width={KEY_WIDTH}
        height={KEY_HEIGHT}
        fill={isHighlighted ? 'hsl(var(--accent))' : 'hsl(var(--card))'}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        className="transition-colors"
      />
    );
  }

  // Dibuja las teclas negras encima de las blancas.
  const blackKeyOffsets = [0.7, 1.7, 3.7, 4.7, 5.7]; // Posiciones relativas de las teclas negras.
  const blackKeyNotes = ['C#', 'D#', 'F#', 'G#', 'A#'];
  for (let octave = 0; octave < 2; octave++) {
    for (let i = 0; i < blackKeyOffsets.length; i++) {
      const x = (blackKeyOffsets[i] + octave * 7) * KEY_WIDTH;
      const keyName = blackKeyNotes[i];
      const isHighlighted = notesToHighlight.has(keyName);
      keyboardKeys.push(
        <rect
          key={`black-${octave}-${i}`}
          x={x}
          y="0"
          width={BLACK_KEY_WIDTH}
          height={BLACK_KEY_HEIGHT}
          fill={isHighlighted ? 'hsl(var(--accent))' : 'hsl(var(--foreground))'}
          className="transition-colors rounded-sm"
        />
      );
    }
  }

  return (
    <svg
      viewBox={`-1 -1 ${totalWhiteKeys * KEY_WIDTH + 2} ${KEY_HEIGHT + 2}`}
      className={className}
      aria-hidden="true"
    >
      <g>
        {keyboardKeys}
      </g>
    </svg>
  );
}
