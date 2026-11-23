'use client'

import { FormatterSettings, HtmlFormatter } from '@chordproject/parser'
import parse from 'html-react-parser'
import { useMemo } from 'react'
import { parseChordSheet } from '@/lib/chordpro'

interface SongLyricsProps {
  chordSheet: string
  className?: string
}

export function SongLyrics({
  chordSheet,
  className = 'text-sm'
}: SongLyricsProps) {
  const parsedReactContent = useMemo(() => {
    const song = parseChordSheet(chordSheet)

    const setting = new FormatterSettings()
    setting.showMetadata = false
    setting.showTabs = false
    setting.useSimpleChord = false
    setting.showChords = false

    const formatter = new HtmlFormatter(setting)
    const htmlString = formatter.format(song).join('')

    return htmlString
  }, [chordSheet])

  return (
    <div className={`font-mono ${className}`}>{parse(parsedReactContent)}</div>
  )
}
