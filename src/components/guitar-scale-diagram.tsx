'use client';

import { cn } from '@/lib/utils';
import { getNoteIndex, notesSharp } from '@/lib/music';

/**
 * Propiedades que el componente GuitarScaleDiagram espera recibir.
 */
interface GuitarScaleDiagramProps {
  scaleNotes: string[]; // Las notas que componen la escala.
  rootNote: string; // La nota raíz de la escala.
  className?: string; // Clases CSS adicionales.
}

// Constantes para el renderizado del SVG del diapasón.
const FRET_COUNT = 12;
const STRING_COUNT = 6;
const FRET_WIDTH = 60;
const STRING_SPACING = 25;
const VIEWBOX_WIDTH = FRET_WIDTH * (FRET_COUNT) + 30 + FRET_WIDTH; 
const VIEWBOX_HEIGHT = STRING_SPACING * (STRING_COUNT - 1) + 60;
const DOT_RADIUS = 9;

// Índices de las notas al aire de una guitarra en afinación estándar (EADGBe), de aguda a grave.
const OPEN_STRING_INDICES = [7, 0, 5, 10, 2, 7].reverse(); // high e to low E

/**
 * Componente que renderiza un diagrama del diapasón de una guitarra mostrando las notas de una escala.
 * @param {GuitarScaleDiagramProps} props - Propiedades del componente.
 * @returns {JSX.Element} El diagrama de la escala en SVG.
 */
export function GuitarScaleDiagram({ scaleNotes, rootNote, className }: GuitarScaleDiagramProps) {
  // Convierte las notas de la escala y la nota raíz a índices numéricos para facilitar los cálculos.
  const scaleNoteIndices = new Set(scaleNotes.map(getNoteIndex));
  const rootNoteIndex = getNoteIndex(rootNote);

  // Calcula la posición de cada nota de la escala en el diapasón.
  const dots = [];
  for (let string = 0; string < STRING_COUNT; string++) {
    for (let fret = 0; fret <= FRET_COUNT; fret++) {
      const noteIndex = (OPEN_STRING_INDICES[string] + fret) % 12;
      if (scaleNoteIndices.has(noteIndex)) {
        dots.push({
          string,
          fret,
          isRoot: noteIndex === rootNoteIndex,
          noteName: notesSharp[noteIndex],
        });
      }
    }
  }

  // Define los trastes que llevan marcadores de posición (inlays).
  const fretMarkers = [3, 5, 7, 9];

  return (
    <div className={cn("overflow-x-auto p-2 bg-background/50 rounded-lg border", className)}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width={VIEWBOX_WIDTH}
        height={VIEWBOX_HEIGHT}
        aria-hidden="true"
        >
        <g transform="translate(30, 25)" className="text-foreground">
            {/* Renderiza los trastes (líneas verticales). */}
            {Array.from({ length: FRET_COUNT + 1 }).map((_, i) => (
            <line
                key={`fret-line-${i}`}
                x1={i * FRET_WIDTH + FRET_WIDTH / 2}
                y1={0}
                x2={i * FRET_WIDTH + FRET_WIDTH / 2}
                y2={STRING_SPACING * (STRING_COUNT - 1)}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={i === 0 ? 5 : 1} // Cejuela más gruesa.
            />
            ))}
            
            {/* Renderiza las cuerdas (líneas horizontales). */}
            {Array.from({ length: STRING_COUNT }).map((_, i) => (
            <line
                key={`string-line-${i}`}
                x1={FRET_WIDTH / 2}
                y1={i * STRING_SPACING}
                x2={FRET_WIDTH * FRET_COUNT + FRET_WIDTH / 2}
                y2={i * STRING_SPACING}
                stroke="currentColor"
                strokeWidth={1 + i * 0.15} // Grosor creciente para simular cuerdas reales.
            />
            ))}

            {/* Renderiza los números de los trastes. */}
            {[...fretMarkers, 12].map(fret => (
                <text 
                    key={`fret-number-${fret}`}
                    x={fret * FRET_WIDTH}
                    y={STRING_SPACING * STRING_COUNT - 5}
                    textAnchor="middle"
                    fontSize="12"
                    fill="hsl(var(--muted-foreground))"
                >
                    {fret}
                </text>
            ))}

            {/* Renderiza los marcadores de posición (inlays). */}
            {fretMarkers.map((fret) => (
                <circle
                    key={`inlay-${fret}`}
                    cx={fret * FRET_WIDTH}
                    cy={STRING_SPACING * 2.5}
                    r="5"
                    fill="hsl(var(--muted-foreground))"
                    opacity="0.3"
                />
            ))}
            {/* Marcadores dobles en el traste 12. */}
            <circle
                cx={12 * FRET_WIDTH}
                cy={STRING_SPACING * 1.5}
                r="5"
                fill="hsl(var(--muted-foreground))"
                opacity="0.3"
            />
             <circle
                cx={12 * FRET_WIDTH}
                cy={STRING_SPACING * 3.5}
                r="5"
                fill="hsl(var(--muted-foreground))"
                opacity="0.3"
            />

            {/* Renderiza los puntos de las notas de la escala. */}
            {dots.map(({ string, fret, isRoot, noteName }, index) => {
                const cx = fret === 0 ? 0 : fret * FRET_WIDTH;
                const cy = string * STRING_SPACING;
                
                return (
                    <g key={`dot-group-${string}-${fret}-${index}`}>
                        <circle
                        cx={cx}
                        cy={cy}
                        r={DOT_RADIUS}
                        fill={isRoot ? 'hsl(var(--accent))' : 'hsl(var(--foreground))'}
                        stroke={isRoot ? 'hsl(var(--accent))' : 'hsl(var(--foreground))'}
                        strokeWidth="2"
                        />
                        <text 
                            x={cx} 
                            y={cy} 
                            textAnchor="middle" 
                            dominantBaseline="central" 
                            fontSize="10" 
                            fill={isRoot ? 'hsl(var(--accent-foreground))' : 'hsl(var(--background))'} 
                            className="font-bold pointer-events-none"
                        >
                            {noteName}
                        </text>
                    </g>
                );
            })}
        </g>
        </svg>
    </div>
  );
}
