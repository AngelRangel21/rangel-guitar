/** biome-ignore-all lint/suspicious/noExplicitAny: explain */

'use client'

import {
  ChordProParser,
  FormatterSettings,
  HtmlFormatter,
  Transposer
} from 'chordproject-parser-fork'
import parse, { attributesToProps, Element } from 'html-react-parser'
import { useMemo } from 'react'
import { Chord } from './chord'

interface SongViewerProps {
  chordSheet: string
  transpose: number
}

const extractText = (node: any): string => {
  if (node.type === 'text') return node.data
  if (node.children) return node.children.map(extractText).join('')
  return ''
}

export function SongViewer({ chordSheet, transpose }: SongViewerProps) {
  const parsedReactContent = useMemo(() => {
    const cp = new ChordProParser()
    let song = cp.parse(chordSheet || '')
    if (transpose !== 0) {
      const direction = transpose > 0 ? 'up' : 'down'
      const steps = Math.abs(transpose)
      for (let i = 0; i < steps; i++) {
        song = Transposer.transpose(song, direction)
      }
    }

    const setting = new FormatterSettings()
    setting.showMetadata = false
    setting.showTabs = true
    setting.useSimpleChord = false
    setting.showChords = true

    const formatter = new HtmlFormatter(setting)
    const htmlString = formatter.format(song).join('\n')

    return parse(htmlString, {
      replace: (domNode) => {
        if (
          domNode instanceof Element &&
          domNode.attribs &&
          domNode.attribs.class?.split(' ').includes('chord')
        ) {
          const props = attributesToProps(domNode.attribs)
          const chordName = extractText(domNode).trim()

          return (
            <Chord
              name={chordName}
              className={domNode.attribs.class}
              transpose={0}
              {...props}
            />
          )
        }
      }
    })
  }, [chordSheet, transpose])

  return <div className='font-mono text-sm'>{parsedReactContent}</div>
}
