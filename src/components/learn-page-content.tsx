'use client'

import { Album, Ear, Gauge, Library, Scale } from 'lucide-react'
import { useI18n } from '@/context/i18n-context'
import { LearnCard } from './learn-card'

export function LearnPageContent() {
  const { t } = useI18n()

  return (
    <main className='grow container mx-auto px-4 py-12'>
      <div className='text-center mb-16 animate-fade-up'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-headline text-foreground'>
          {t('learnPageTitle')}
        </h1>
        <p className='mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>
          {t('learnPageDescription')}
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <div className='animate-fade-up' style={{ animationDelay: '100ms' }}>
          <LearnCard
            href='/chords'
            icon={<Library className='h-10 w-10' />}
            title={t('chordLibrary')}
            description={t('chordLibraryDescription')}
          />
        </div>
        <div className='animate-fade-up' style={{ animationDelay: '200ms' }}>
          <LearnCard
            href='/scales'
            icon={<Scale className='h-10 w-10' />}
            title={t('scaleLibrary')}
            description={t('scaleLibraryDescription')}
          />
        </div>
        <div className='animate-fade-up' style={{ animationDelay: '300ms' }}>
          <LearnCard
            href='/learn/metronome'
            icon={<Gauge className='h-10 w-10' />}
            title={t('metronome')}
            description={t('metronomeDescription')}
          />
        </div>
        <div className='animate-fade-up' style={{ animationDelay: '400ms' }}>
          <LearnCard
            href='/learn/ear-trainer'
            icon={<Ear className='h-10 w-10' />}
            title={t('earTrainer')}
            description={t('earTrainerDescription')}
          />
        </div>
        <div className='animate-fade-up' style={{ animationDelay: '500ms' }}>
          <LearnCard
            href='/learn/circle-of-fifths'
            icon={<Album className='h-10 w-10' />}
            title={t('circleOfFifths')}
            description={t('circleOfFifthsDescription')}
          />
        </div>
      </div>
    </main>
  )
}
