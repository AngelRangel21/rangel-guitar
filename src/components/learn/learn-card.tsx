import { ArrowUpRight, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ComponentProps, JSX, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface LearnCardProps {
  href: ComponentProps<typeof Link>['href']
  icon: LucideIcon
  title: string
  description: string
  /** Ilustración decorativa de la herramienta. */
  visual: ReactNode
  /** Muestra la etiqueta de "en pruebas". */
  isBeta?: boolean
  className?: string
}

/** Tarjeta de acceso a una herramienta de aprendizaje. */
export function LearnCard({
  href,
  icon: Icon,
  title,
  description,
  visual,
  isBeta = false,
  className
}: LearnCardProps): JSX.Element {
  const t = useTranslations('learnPage')

  return (
    <Link
      href={href}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      <div className='relative flex h-40 items-center justify-center border-b bg-muted/40 p-5 transition-colors group-hover:bg-muted/70'>
        <div className='h-full transition-transform duration-500 group-hover:scale-105'>
          {visual}
        </div>
        {isBeta && (
          <span className='absolute right-3 top-3 rounded-full border bg-background/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur-sm'>
            {t('beta')}
          </span>
        )}
      </div>

      <div className='flex flex-1 flex-col gap-2 p-5'>
        <div className='flex items-center gap-2.5'>
          <span className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
            <Icon aria-hidden='true' className='size-4' />
          </span>
          <h3 className='text-lg font-semibold tracking-tight text-foreground'>
            {title}
          </h3>
        </div>
        <p className='flex-1 text-sm text-pretty text-muted-foreground'>
          {description}
        </p>
        <span className='mt-2 inline-flex items-center gap-1 text-sm font-semibold text-foreground'>
          {t('open')}
          <ArrowUpRight
            aria-hidden='true'
            className='size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
          />
        </span>
      </div>
    </Link>
  )
}
