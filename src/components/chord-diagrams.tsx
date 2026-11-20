'use client'

import parse from 'html-react-parser'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useI18n } from '@/context/i18n-context'
import { getKeyboardChordNotes } from '@/lib/chordpro'
import { getGuitarChordSvg, resolveGuitarChord } from '@/lib/guitar-chords'
import { KeyboardChordDiagram } from './keyboard-chord-diagram'

/**
 * Diagramas de un acorde para guitarra y teclado, en pestañas.
 * - Guitarra: SVG generado por instruments-chords (getChordSvg), con todas
 *   las variantes de la librería.
 * - Teclado: notas calculadas por @chordproject/parser.
 * Se monta cada vez que se abre el popover, así que la variante empieza en 0.
 */
export function ChordDiagrams({ chordName }: { chordName: string }) {
  const { t } = useI18n()
  const [variationIndex, setVariationIndex] = useState(0)

  const guitarChord = useMemo(() => resolveGuitarChord(chordName), [chordName])
  const variants = guitarChord?.variants ?? []
  const currentVariant = variants[variationIndex] ?? null

  const guitarSvg = useMemo(() => {
    if (!guitarChord || !currentVariant) return null
    const svg = getGuitarChordSvg(guitarChord, currentVariant)
    return svg ? parse(svg) : null
  }, [guitarChord, currentVariant])

  const keyboardNotes = useMemo(
    () => getKeyboardChordNotes(chordName),
    [chordName]
  )

  const hasMultipleVariations = variants.length > 1

  const nextVariation = () => {
    setVariationIndex((prev) => (prev + 1) % variants.length)
  }

  const prevVariation = () => {
    setVariationIndex((prev) => (prev - 1 + variants.length) % variants.length)
  }

  return (
    <div suppressHydrationWarning={true}>
      <div className='flex items-center justify-between mb-2'>
        <h4 className='font-bold text-lg'>
          {t('chord')}: <span className='text-blue-800'>{chordName}</span>
        </h4>
        {hasMultipleVariations && (
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={prevVariation}
              className='h-6 w-6'
              aria-label={t('previous')}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <span className='text-xs text-muted-foreground' aria-live='polite'>
              {variationIndex + 1} / {variants.length}
            </span>
            <Button
              variant='ghost'
              size='icon'
              onClick={nextVariation}
              className='h-6 w-6'
              aria-label={t('next')}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue='guitar' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='guitar'>{t('guitar')}</TabsTrigger>
          <TabsTrigger value='keyboard'>{t('keyboard')}</TabsTrigger>
        </TabsList>
        <TabsContent value='guitar'>
          <Card>
            <CardContent className='p-4 flex justify-center items-center'>
              {guitarSvg ? (
                <figure
                  aria-label={`${t('guitar')}: ${chordName}`}
                  className='w-32 text-foreground [&_svg]:h-auto [&_svg]:w-full'
                >
                  {guitarSvg}
                </figure>
              ) : (
                <p className='text-sm text-muted-foreground p-4'>
                  {t('chordDiagramNotAvailable')}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='keyboard'>
          <Card>
            <CardContent className='p-4 flex justify-center items-center gap-4 overflow-x-auto'>
              {keyboardNotes.length > 0 ? (
                <KeyboardChordDiagram
                  notes={keyboardNotes}
                  className='w-48 h-auto'
                />
              ) : (
                <p className='text-sm text-muted-foreground p-4'>
                  {t('chordDiagramNotAvailable')}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
