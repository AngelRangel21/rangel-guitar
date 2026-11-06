'use client'

import { ChordsList } from '@/components/chords-list'
import { useI18n } from '@/context/i18n-context'
import { majorChords, minorChords, seventhChords } from '@/lib/chords-data'

export function ChordsPageContent() {
  const { t } = useI18n()

  return (
    <main className='grow container mx-auto px-4 py-8 space-y-8'>
      <h1 className='text-4xl font-bold text-center'>{t('chordsPageTitle')}</h1>
      {/* Componente que renderiza las listas de acordes. */}
      <ChordsList
        majorChords={majorChords}
        minorChords={minorChords}
        seventhChords={seventhChords}
      />
    </main>
  )
}
