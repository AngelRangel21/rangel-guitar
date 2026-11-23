import {
  Ear,
  Gauge,
  GraduationCap,
  Library,
  type LucideIcon,
  Music,
  Orbit,
  Scale
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ComponentProps, JSX, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { LearnCard } from './learn-card'
import {
  ChordVisual,
  CircleVisual,
  EarVisual,
  MetronomeVisual,
  ScaleVisual
} from './learn-visuals'

interface Tool {
  href: ComponentProps<typeof Link>['href']
  icon: LucideIcon
  titleKey: string
  descriptionKey: string
  visual: ReactNode
  isBeta?: boolean
}

const THEORY_TOOLS: Tool[] = [
  {
    href: '/chords',
    icon: Library,
    titleKey: 'chordLibrary',
    descriptionKey: 'chordLibraryDescription',
    visual: <ChordVisual />
  },
  {
    href: '/scales',
    icon: Scale,
    titleKey: 'scaleLibrary',
    descriptionKey: 'scaleLibraryDescription',
    visual: <ScaleVisual />
  },
  {
    href: '/learn/circle-of-fifths',
    icon: Orbit,
    titleKey: 'circleOfFifths',
    descriptionKey: 'circleOfFifthsDescription',
    visual: <CircleVisual />,
    isBeta: true
  }
]

const PRACTICE_TOOLS: Tool[] = [
  {
    href: '/learn/metronome',
    icon: Gauge,
    titleKey: 'metronome',
    descriptionKey: 'metronomeDescription',
    visual: <MetronomeVisual />,
    isBeta: true
  },
  {
    href: '/learn/ear-trainer',
    icon: Ear,
    titleKey: 'earTrainer',
    descriptionKey: 'earTrainerDescription',
    visual: <EarVisual />,
    isBeta: true
  }
]

interface ToolSectionProps {
  id: string
  step: string
  title: string
  description: string
  tools: Tool[]
  gridClassName: string
}

function ToolSection({
  id,
  step,
  title,
  description,
  tools,
  gridClassName
}: ToolSectionProps): JSX.Element {
  // Las claves de cada herramienta viven en la raíz de los mensajes.
  const t = useTranslations()

  return (
    <section aria-labelledby={id} className='space-y-5'>
      <header className='flex items-end gap-4'>
        <span
          aria-hidden='true'
          className='text-4xl font-bold leading-none tabular-nums text-muted-foreground/30 md:text-5xl'
        >
          {step}
        </span>
        <div className='space-y-1'>
          <h2
            id={id}
            className='text-2xl font-bold tracking-tight text-foreground md:text-3xl font-headline'
          >
            {title}
          </h2>
          <p className='text-sm text-muted-foreground md:text-base'>
            {description}
          </p>
        </div>
      </header>

      <ul className={gridClassName}>
        {tools.map((tool) => (
          <li key={tool.titleKey}>
            <LearnCard
              href={tool.href}
              icon={tool.icon}
              title={t(tool.titleKey)}
              description={t(tool.descriptionKey)}
              visual={tool.visual}
              isBeta={tool.isBeta}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Centro de acceso a las herramientas de aprendizaje. */
export function LearnPageContent(): JSX.Element {
  const t = useTranslations('learnPage')
  const toolCount = THEORY_TOOLS.length + PRACTICE_TOOLS.length

  return (
    <main className='grow container mx-auto space-y-16 px-4 py-6 md:py-10'>
      {/* ── Hero ── */}
      <section
        aria-labelledby='learn-heading'
        className='rounded-3xl border bg-linear-to-b from-muted/60 to-background px-4 py-12 text-center sm:px-8 md:py-16 animate-fade-up'
      >
        <div className='mx-auto flex max-w-2xl flex-col items-center gap-5'>
          <p className='inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground'>
            <GraduationCap aria-hidden='true' className='size-3.5' />
            {t('eyebrow')}
          </p>
          <h1
            id='learn-heading'
            className='text-4xl font-bold tracking-tight text-balance text-foreground md:text-5xl lg:text-6xl font-headline'
          >
            {t('title')}
          </h1>
          <p className='max-w-xl text-base text-pretty text-muted-foreground md:text-lg'>
            {t('description')}
          </p>
          <ul className='flex flex-wrap items-center justify-center gap-2 text-sm'>
            <li className='rounded-full border bg-background px-3 py-1 text-muted-foreground'>
              {t('toolCount', { count: toolCount })}
            </li>
            <li className='rounded-full border bg-background px-3 py-1 text-muted-foreground'>
              {t('free')}
            </li>
            <li className='rounded-full border bg-background px-3 py-1 text-muted-foreground'>
              {t('noSignup')}
            </li>
          </ul>
        </div>
      </section>

      <div
        className='space-y-16 animate-fade-up'
        style={{ animationDelay: '100ms' }}
      >
        <ToolSection
          id='learn-theory'
          step='01'
          title={t('theory.title')}
          description={t('theory.description')}
          tools={THEORY_TOOLS}
          gridClassName='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
        />

        <ToolSection
          id='learn-practice'
          step='02'
          title={t('practice.title')}
          description={t('practice.description')}
          tools={PRACTICE_TOOLS}
          gridClassName='grid gap-4 sm:grid-cols-2'
        />
      </div>

      {/* ── Llamada a la acción ── */}
      <section
        aria-labelledby='learn-cta'
        className='flex flex-col items-start gap-6 rounded-3xl bg-primary p-8 text-primary-foreground md:flex-row md:items-center md:justify-between md:p-10'
      >
        <div className='space-y-2'>
          <h2
            id='learn-cta'
            className='text-2xl font-bold tracking-tight md:text-3xl font-headline'
          >
            {t('cta.title')}
          </h2>
          <p className='max-w-lg text-primary-foreground/75'>
            {t('cta.description')}
          </p>
        </div>
        <Link
          href='/'
          className='inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary-foreground px-6 text-sm font-semibold text-primary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
        >
          <Music aria-hidden='true' className='size-4' />
          {t('cta.button')}
        </Link>
      </section>
    </main>
  )
}
