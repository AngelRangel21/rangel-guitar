import React, { JSX } from 'react'
import { Chord } from './chord'

// SOLO detecta cosas entre [] o ()
const CHORD_WRAPPER_REGEX = /(\[(.*?)\]|\((.*?)\))/g

const VALID_CHORD_REGEX =
  /^([A-G])(#{1}|b{1})?(m|min|maj|dim|aug|sus2|sus4)?(7|9|11|13)?(\/[A-G](#|b)?)?$/

export function isValidChord (input: string): boolean {
  return VALID_CHORD_REGEX.test(input)
}

export type SongToken =
  | { type: 'text', value: string }
  | { type: 'chord', value: string }
  | { type: 'section', value: string }

export function parseChordLine (line: string): SongToken[] {
  const tokens: SongToken[] = []
  let lastIndex = 0

  line.replace(CHORD_WRAPPER_REGEX, (match, _, a, b, index) => {
    if (index > lastIndex) {
      tokens.push({
        type: 'text',
        value: line.slice(lastIndex, index)
      })
    }

    const content = a || b

    if (isSectionMarker(match)) {
      tokens.push({ type: 'section', value: match })
    } else if (isValidChord(content)) {
      tokens.push({ type: 'chord', value: content })
    } else {
      tokens.push({ type: 'text', value: match })
    }

    lastIndex = index + match.length
    return match
  })

  if (lastIndex < line.length) {
    tokens.push({
      type: 'text',
      value: line.slice(lastIndex)
    })
  }

  return tokens
}

const KNOWN_SECTIONS = ([
  'intro',
  'verso',
  'coro',
  'bridge',
  'solo',
  'outro',
  'instrumental',
  'capo',
  'pre-coro',
  'post-coro',
  // generar con numeros
  ...Array.from({ length: 5 }, (_, i) => `verso ${i + 1}`)
])

const isSectionMarker = (text: string): boolean => {
  if (!text.startsWith('[') || !text.endsWith(']')) {
    return false
  }
  // Extrae el contenido dentro de los corchetes y lo convierte a minúsculas.
  const content = text
    .substring(1, text.length - 1)
    .toLowerCase()
  return KNOWN_SECTIONS.includes(content)
}

export function ChordSheet ({
  text,
  transpose = 0
}: {
  text: string
  transpose?: number
}): JSX.Element | null {
  if (!text) return null
  // Renderiza la hoja de acordes, dividiendo el texto en líneas y luego en tokens para cada línea.
  return (
    <div className='text-sm font-sans'>
      {text.split('\n').map((line, lineIndex) => {
        if (!line.trim()) {
          return <div key={lineIndex} className='h-4' />
        }

        const tokens = parseChordLine(line)
        // Renderiza cada token de la línea, mostrando los acordes como componentes interactivos y las secciones en negrita.
        return (
          <div key={lineIndex} className='whitespace-pre'>
            {tokens.map((token, i) => {
              if (token.type === 'chord') {
                return (
                  <Chord
                    key={i}
                    name={token.value}
                    transpose={transpose}
                  />
                )
              }
              // Si el token es una sección, lo renderiza en negrita. ej: [Intro], [Verso], etc.
              if (token.type === 'section') {
                return (
                  <strong key={i} className='font-bold'>
                    {token.value}
                  </strong>
                )
              }

              return <React.Fragment key={i}>{token.value}</React.Fragment>
            })}
          </div>
        )
      })}
    </div>
  )
}
