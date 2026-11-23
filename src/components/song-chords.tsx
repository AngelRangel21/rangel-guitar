/** biome-ignore-all lint/suspicious/noExplicitAny: explain */

'use client'

import {
  FormatterSettings,
  HtmlFormatter,
  type Song
} from '@chordproject/parser'
import parse, { attributesToProps, Element } from 'html-react-parser'
import { useMemo } from 'react'
import { Chord } from './chord'

interface SongViewerProps {
  song: Song
  className?: string
}

const extractText = (node: any): string => {
  if (node.type === 'text') return node.data
  if (node.children) return node.children.map(extractText).join('')
  return ''
}

export function SongViewer({ song, className = 'text-sm' }: SongViewerProps) {
  const parsedReactContent = useMemo(() => {
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
              {...props}
            />
          )
        }
      }
    })
  }, [song])

  return <div className={`font-mono ${className}`}>{parsedReactContent}</div>
}
