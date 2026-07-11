'use client'

import {
  ChordProParser,
  FormatterSettings,
  HtmlFormatter
} from 'chordproject-parser-fork'
import parse from 'html-react-parser'
import { useMemo } from 'react'

interface SongLyricsProps {
  chordSheet: string
}

export function SongLyrics({ chordSheet }: SongLyricsProps) {
  const parsedReactContent = useMemo(() => {
    const cp = new ChordProParser()
    const song = cp.parse(chordSheet || '')

    const setting = new FormatterSettings()
    setting.showMetadata = false
    setting.showTabs = false
    setting.useSimpleChord = false
    setting.showChords = false

    const formatter = new HtmlFormatter(setting)
    const htmlString = formatter.format(song).join('')

    return htmlString
  }, [chordSheet])

  return <div className='font-mono text-sm'>{parse(parsedReactContent)}</div>
}
