'use client'

import { Library } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ChordsList } from '@/components/chords-list'
import { PageHeader, PageShell } from '@/components/layout/page-header'
import { useI18n } from '@/context/i18n-context'
import { majorChords, minorChords, seventhChords } from '@/lib/chords-data'

export function ChordsPageContent() {
  const { t } = useI18n()
  const tc = useTranslations('chordsPage')
  const tl = useTranslations('learnPage')

  return (
    <PageShell>
      <PageHeader
        back={{ href: '/learn', label: tc('back') }}
        eyebrow={{ icon: Library, label: tl('theory.title') }}
        title={t('chordsPageTitle')}
        description={t('chordLibraryDescription')}
      />
      <ChordsList
        majorChords={majorChords}
        minorChords={minorChords}
        seventhChords={seventhChords}
      />
    </PageShell>
  )
}
