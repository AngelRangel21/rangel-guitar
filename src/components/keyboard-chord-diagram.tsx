import React from 'react';
import { cn } from '@/lib/utils';

interface KeyboardChordDiagramProps {
  notes: string[];
  className?: string;
}

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const ALL_NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ALL_NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const KEY_WIDTH = 20;
const KEY_HEIGHT = 100;
const BLACK_KEY_WIDTH = 12;
const BLACK_KEY_HEIGHT = 65;

export function KeyboardChordDiagram({ notes, className }: KeyboardChordDiagramProps) {
  const notesToHighlight = new Set(notes.map(note => {
    const flatIndex = ALL_NOTES_FLAT.indexOf(note);
    return flatIndex !== -1 ? ALL_NOTES_SHARP[flatIndex] : note;
  }));

  const keyboardKeys = [];
  const totalWhiteKeys = 14; // Render two octaves

  // Draw white keys first
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

  // Draw black keys on top
  const blackKeyOffsets = [0.7, 1.7, 3.7, 4.7, 5.7];
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
