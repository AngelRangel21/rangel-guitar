import type { ChordShape } from '@/lib/chord-shapes';

interface GuitarChordDiagramProps {
  positions: ChordShape;
  baseFret?: number;
  className?: string;
}

const FRET_COUNT = 5;
const STRING_COUNT = 6;
const FRET_HEIGHT = 22;
const STRING_SPACING = 15;
const VIEWBOX_WIDTH = STRING_SPACING * (STRING_COUNT - 1) + 20;
const VIEWBOX_HEIGHT = FRET_HEIGHT * FRET_COUNT + 40;
const FINGER_DOT_RADIUS = 5;

export function GuitarChordDiagram({ positions, baseFret = 1, className }: GuitarChordDiagramProps) {
  const dots = positions
    .map((fret, string) => ({ fret, string }))
    .filter(d => typeof d.fret === 'number' && d.fret > 0);

  // Find barre chords
  const barreFretMap: { [key: number]: number[] } = {};
  dots.forEach(dot => {
    if (!barreFretMap[dot.fret]) {
      barreFretMap[dot.fret] = [];
    }
    barreFretMap[dot.fret].push(dot.string);
  });

  const barres = Object.entries(barreFretMap)
    .filter(([, strings]) => strings.length > 2) // A barre must cover at least 3 strings
    .map(([fret, strings]) => ({
      fret: Number(fret),
      from: Math.min(...strings),
      to: Math.max(...strings),
    }));

  const dotsToRender = dots.filter(
    dot => !barres.some(barre => barre.fret === dot.fret && dot.string >= barre.from && dot.string <= barre.to)
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(10, 25)" className="text-foreground">
        {/* Fretboard */}
        {Array.from({ length: FRET_COUNT + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={0}
            y1={i * FRET_HEIGHT}
            x2={STRING_SPACING * (STRING_COUNT - 1)}
            y2={i * FRET_HEIGHT}
            stroke="currentColor"
            strokeWidth={i === 0 && baseFret === 1 ? '3' : '1'} // Thicker nut for open chords
          />
        ))}
        {Array.from({ length: STRING_COUNT }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={i * STRING_SPACING}
            y1={0}
            x2={i * STRING_SPACING}
            y2={FRET_HEIGHT * FRET_COUNT}
            stroke="currentColor"
            strokeWidth="0.5"
          />
        ))}

        {/* Base Fret Number */}
        {baseFret > 1 && (
          <text
            x={-8}
            y={FRET_HEIGHT * 0.75}
            fontSize="10"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
          >
            {baseFret}
          </text>
        )}

        {/* Muted/Open String Markers */}
        {positions.map((fret, string) => {
          const x = string * STRING_SPACING;
          if (fret === 'x') {
            return (
              <g key={`marker-${string}`}>
                <line x1={x-3} y1={-12} x2={x+3} y2={-6} stroke="currentColor" strokeWidth="1.5" />
                <line x1={x-3} y1={-6} x2={x+3} y2={-12} stroke="currentColor" strokeWidth="1.5" />
              </g>
            );
          }
          if (fret === 0) {
            return (
              <circle
                key={`marker-${string}`}
                cx={x}
                cy={-9}
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            );
          }
          return null;
        })}
        
        {/* Barre Chords */}
        {barres.map(({ fret, from, to }) => {
          const fretPosition = fret - (baseFret > 1 ? baseFret - 1 : 0);
          if (fretPosition <= 0 || fretPosition > FRET_COUNT) return null;
          const y = (fretPosition * FRET_HEIGHT) - (FRET_HEIGHT / 2);
          const startX = from * STRING_SPACING;
          const endX = to * STRING_SPACING;
          return (
            <rect
              key={`barre-${fret}`}
              x={startX}
              y={y - FINGER_DOT_RADIUS}
              width={endX - startX}
              height={FINGER_DOT_RADIUS * 2}
              rx={FINGER_DOT_RADIUS}
              ry={FINGER_DOT_RADIUS}
              fill="currentColor"
            />
          );
        })}

        {/* Finger Dots */}
        {dotsToRender.map(({ fret, string }) => {
          const fretPosition = fret - (baseFret > 1 ? baseFret - 1 : 0);
          if (fretPosition <= 0 || fretPosition > FRET_COUNT) return null;
          const y = (fretPosition * FRET_HEIGHT) - (FRET_HEIGHT / 2);
          const x = string * STRING_SPACING;
          return (
            <circle
              key={`dot-${string}`}
              cx={x}
              cy={y}
              r={FINGER_DOT_RADIUS}
              fill="currentColor"
            />
          );
        })}
      </g>
    </svg>
  );
}
