import type { JSX } from 'react'

/**
 * Ilustraciones decorativas de cada herramienta de "Aprender".
 * Son SVG en línea que usan los colores del tema (claro/oscuro).
 */

const SVG_CLASS = 'h-full w-auto max-w-full overflow-visible'

const STRING_X = [20, 36, 52, 68, 84, 100] as const
const FRET_Y = [35, 55, 75, 95] as const

/** Diagrama del acorde de Do mayor (x32010). */
export function ChordVisual(): JSX.Element {
  // [cuerda (0 = 6ª), traste] de cada dedo
  const fingers = [
    [1, 3],
    [2, 2],
    [4, 1]
  ] as const

  return (
    <svg
      viewBox='0 0 120 100'
      aria-hidden='true'
      focusable='false'
      className={SVG_CLASS}
    >
      <rect
        x='18'
        y='13'
        width='84'
        height='4'
        rx='1'
        className='fill-foreground'
      />
      {FRET_Y.map((y) => (
        <line
          key={y}
          x1='20'
          x2='100'
          y1={y}
          y2={y}
          className='stroke-border'
          strokeWidth='2'
        />
      ))}
      {STRING_X.map((x, i) => (
        <line
          key={x}
          x1={x}
          x2={x}
          y1='15'
          y2='95'
          className='stroke-muted-foreground/60'
          strokeWidth={1 + (5 - i) * 0.25}
        />
      ))}
      {/* Cuerda al aire (o) y silenciada (×) */}
      <text
        x='20'
        y='9'
        textAnchor='middle'
        className='fill-muted-foreground text-[9px]'
      >
        ×
      </text>
      {[3, 5].map((s) => (
        <circle
          key={s}
          cx={STRING_X[s]}
          cy='6'
          r='3'
          fill='none'
          className='stroke-muted-foreground'
          strokeWidth='1.2'
        />
      ))}
      {fingers.map(([s, fret]) => (
        <circle
          key={s}
          cx={STRING_X[s]}
          cy={15 + fret * 20 - 10}
          r='6'
          className={s === 1 ? 'fill-primary' : 'fill-foreground/80'}
        />
      ))}
    </svg>
  )
}

/** Primera caja de la pentatónica de La menor. */
export function ScaleVisual(): JSX.Element {
  const stringsY = [15, 29, 43, 57, 71, 85] as const // 1ª (aguda) → 6ª
  const fretX = [10, 35, 60, 85, 110] as const
  const cellX = [22.5, 47.5, 72.5, 97.5] as const
  // [cuerda (0 = 1ª), celda, esTónica]
  const notes: Array<[number, number, boolean]> = [
    [0, 0, true],
    [0, 3, false],
    [1, 0, false],
    [1, 3, false],
    [2, 0, false],
    [2, 2, false],
    [3, 0, false],
    [3, 2, true],
    [4, 0, false],
    [4, 2, false],
    [5, 0, true],
    [5, 3, false]
  ]

  return (
    <svg
      viewBox='0 0 120 100'
      aria-hidden='true'
      focusable='false'
      className={SVG_CLASS}
    >
      {fretX.map((x) => (
        <line
          key={x}
          x1={x}
          x2={x}
          y1='15'
          y2='85'
          className='stroke-border'
          strokeWidth='2'
        />
      ))}
      {stringsY.map((y, i) => (
        <line
          key={y}
          x1='10'
          x2='110'
          y1={y}
          y2={y}
          className='stroke-muted-foreground/60'
          strokeWidth={1 + i * 0.25}
        />
      ))}
      {notes.map(([s, c, isRoot]) => (
        <circle
          key={`${s}-${c}`}
          cx={cellX[c]}
          cy={stringsY[s]}
          r='5'
          className={isRoot ? 'fill-primary' : 'fill-foreground/70'}
        />
      ))}
    </svg>
  )
}

const CIRCLE_KEYS = [
  'C',
  'G',
  'D',
  'A',
  'E',
  'B',
  'F♯',
  'D♭',
  'A♭',
  'E♭',
  'B♭',
  'F'
] as const

/** Círculo de quintas con Do resaltado. */
export function CircleVisual(): JSX.Element {
  const cx = 60
  const cy = 50
  const r = 38

  return (
    <svg
      viewBox='0 0 120 100'
      aria-hidden='true'
      focusable='false'
      className={SVG_CLASS}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill='none'
        className='stroke-border'
        strokeWidth='1.5'
      />
      <circle
        cx={cx}
        cy={cy}
        r='20'
        fill='none'
        className='stroke-border'
        strokeDasharray='2 3'
      />
      {CIRCLE_KEYS.map((key, i) => {
        const angle = (i / CIRCLE_KEYS.length) * Math.PI * 2 - Math.PI / 2
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r
        const isActive = i === 0
        return (
          <g key={key}>
            <circle
              cx={x}
              cy={y}
              r='7.5'
              className={
                isActive ? 'fill-primary' : 'fill-background stroke-border'
              }
            />
            <text
              x={x}
              y={y}
              dy='0.35em'
              textAnchor='middle'
              className={`text-[7px] font-semibold ${
                isActive ? 'fill-primary-foreground' : 'fill-muted-foreground'
              }`}
            >
              {key}
            </text>
          </g>
        )
      })}
      <text
        x={cx}
        y={cy}
        dy='0.35em'
        textAnchor='middle'
        className='fill-foreground text-[11px] font-bold'
      >
        C
      </text>
    </svg>
  )
}

/** Metrónomo de péndulo. */
export function MetronomeVisual(): JSX.Element {
  return (
    <svg
      viewBox='0 0 120 100'
      aria-hidden='true'
      focusable='false'
      className={SVG_CLASS}
    >
      <path
        d='M42 92 L78 92 L69 12 L51 12 Z'
        className='fill-muted stroke-border'
        strokeWidth='2'
        strokeLinejoin='round'
      />
      {[30, 42, 54, 66].map((y) => (
        <line
          key={y}
          x1='55'
          x2='65'
          y1={y}
          y2={y}
          className='stroke-muted-foreground/50'
          strokeWidth='1.5'
        />
      ))}
      <line
        x1='60'
        y1='82'
        x2='78'
        y2='18'
        className='stroke-foreground'
        strokeWidth='2.5'
        strokeLinecap='round'
      />
      <rect
        x='68'
        y='40'
        width='12'
        height='8'
        rx='2'
        transform='rotate(16 74 44)'
        className='fill-primary'
      />
      <circle cx='60' cy='82' r='3.5' className='fill-foreground' />
      {/* Marcas del recorrido del péndulo */}
      <path
        d='M38 22 Q60 8 82 22'
        fill='none'
        className='stroke-muted-foreground/40'
        strokeDasharray='2 3'
      />
    </svg>
  )
}

const WAVE = [
  14, 26, 18, 40, 30, 56, 44, 70, 52, 38, 60, 34, 24, 42, 20, 12
] as const

/** Ecualizador / onda de sonido. */
export function EarVisual(): JSX.Element {
  const barWidth = 4
  const gap = 3
  const total = WAVE.length * (barWidth + gap) - gap
  const startX = (120 - total) / 2

  return (
    <svg
      viewBox='0 0 120 100'
      aria-hidden='true'
      focusable='false'
      className={SVG_CLASS}
    >
      {WAVE.map((h, i) => {
        const x = startX + i * (barWidth + gap)
        const isPeak = i >= 6 && i <= 10
        return (
          <rect
            // biome-ignore lint/suspicious/noArrayIndexKey: lista estática
            key={i}
            x={x}
            y={50 - h / 2}
            width={barWidth}
            height={h}
            rx='2'
            className={isPeak ? 'fill-primary' : 'fill-muted-foreground/40'}
          />
        )
      })}
    </svg>
  )
}
