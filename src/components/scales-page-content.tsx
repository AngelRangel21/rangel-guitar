'use client'

import { Scale } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { PageHeader, PageShell } from '@/components/layout/page-header'
import { SegmentedControl } from '@/components/layout/segmented-control'
import { useI18n } from '@/context/i18n-context'
import { getScaleNotes } from '@/lib/music'
import { cn } from '@/lib/utils'
import { ScaleDisplay } from './scale-display'

interface ScalesPageContentProps {
  rootNotes: string[]
  scaleTypes: ('major' | 'minor')[]
}

type ScaleType = 'major' | 'minor'

/**
 * Biblioteca de escalas: elige la nota raíz y el tipo de escala y se muestran
 * sus notas y diagramas. Empieza en Do mayor para no mostrar la página vacía.
 */
export function ScalesPageContent({
  rootNotes,
  scaleTypes
}: ScalesPageContentProps) {
  const { t } = useI18n()
  const ts = useTranslations('scalesPage')
  const tl = useTranslations('learnPage')
  const [selectedRoot, setSelectedRoot] = useState<string>(
    rootNotes.includes('C') ? 'C' : (rootNotes[0] ?? '')
  )
  const [selectedType, setSelectedType] = useState<ScaleType>(
    scaleTypes[0] ?? 'major'
  )

  const scaleNotes = useMemo(
    () => (selectedRoot ? getScaleNotes(selectedRoot, selectedType) : []),
    [selectedRoot, selectedType]
  )

  return (
    <PageShell>
      <PageHeader
        back={{ href: '/learn', label: ts('back') }}
        eyebrow={{ icon: Scale, label: tl('theory.title') }}
        title={t('scalesPageTitle')}
        description={t('scaleLibraryDescription')}
      />

      <section
        aria-label={ts('pickerLabel')}
        className='space-y-5 rounded-2xl border bg-card p-4 sm:p-6'
      >
        <fieldset className='space-y-3'>
          <legend className='mb-3 text-sm font-semibold text-foreground'>
            {t('selectRootNote')}
          </legend>
          <div className='grid grid-cols-6 gap-2 sm:grid-cols-12'>
            {rootNotes.map((note) => {
              const isActive = note === selectedRoot
              return (
                <button
                  key={note}
                  type='button'
                  onClick={() => setSelectedRoot(note)}
                  aria-pressed={isActive}
                  className={cn(
                    'h-11 rounded-xl border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'bg-background text-foreground hover:bg-muted'
                  )}
                >
                  {note}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className='flex flex-wrap items-center gap-3'>
          <span className='text-sm font-semibold text-foreground'>
            {t('selectScaleType')}
          </span>
          <SegmentedControl<ScaleType>
            label={t('selectScaleType')}
            value={selectedType}
            onChange={setSelectedType}
            options={scaleTypes.map((type) => ({
              value: type,
              label: t(type)
            }))}
          />
        </div>
      </section>

      {scaleNotes.length > 0 && selectedRoot && (
        <ScaleDisplay
          rootNote={selectedRoot}
          scaleType={selectedType}
          scaleNotes={scaleNotes}
        />
      )}
    </PageShell>
  )
}
