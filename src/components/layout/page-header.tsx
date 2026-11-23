import { ArrowLeft, type LucideIcon } from 'lucide-react'
import type { ComponentProps, JSX, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  /** Etiqueta pequeña sobre el título. */
  eyebrow?: { icon?: LucideIcon; label: ReactNode }
  /** Botones o enlaces a la derecha (debajo en móvil). */
  actions?: ReactNode
  /** Contenido extra bajo la descripción (estadísticas, filtros…). */
  children?: ReactNode
  /** Enlace para volver a la página anterior. */
  back?: { href: ComponentProps<typeof Link>['href']; label: string }
  /** `banner`: caja con borde y degradado. `plain`: solo texto. */
  variant?: 'banner' | 'plain'
  align?: 'left' | 'center'
  /** Contenido visual a la derecha del texto (imagen, ilustración). */
  media?: ReactNode
  className?: string
  titleId?: string
}

/**
 * Cabecera común de las páginas. Mantiene el mismo lenguaje visual que el
 * hero de la home: etiqueta en "pastilla", título grande y descripción.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  children,
  back,
  variant = 'banner',
  align = 'left',
  media,
  className,
  titleId
}: PageHeaderProps): JSX.Element {
  const isCentered = align === 'center'
  const EyebrowIcon = eyebrow?.icon

  return (
    <header
      className={cn(
        'relative animate-fade-up',
        variant === 'banner' &&
          'overflow-hidden rounded-3xl border bg-linear-to-b from-muted/60 to-background px-5 py-8 sm:px-8 md:py-12',
        className
      )}
    >
      {back != null && (
        <Link
          href={back.href}
          className='mb-6 inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          <ArrowLeft aria-hidden='true' className='size-4' />
          {back.label}
        </Link>
      )}

      <div
        className={cn(
          'flex flex-col gap-6',
          media != null && 'md:flex-row md:items-center',
          !isCentered && actions != null && 'md:flex-row md:items-end'
        )}
      >
        {media != null && <div className='shrink-0'>{media}</div>}

        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col gap-4',
            isCentered && 'mx-auto max-w-2xl items-center text-center'
          )}
        >
          {eyebrow != null && (
            <p className='inline-flex w-fit items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground'>
              {EyebrowIcon != null && (
                <EyebrowIcon aria-hidden='true' className='size-3.5' />
              )}
              {eyebrow.label}
            </p>
          )}

          <div className='space-y-3'>
            <h1
              id={titleId}
              className='text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl font-headline'
            >
              {title}
            </h1>
            {description != null && (
              <p
                className={cn(
                  'max-w-2xl text-base text-pretty text-muted-foreground md:text-lg',
                  isCentered && 'mx-auto'
                )}
              >
                {description}
              </p>
            )}
          </div>

          {children}
        </div>

        {actions != null && (
          <div
            className={cn(
              'flex shrink-0 flex-wrap items-center gap-2',
              isCentered && 'justify-center'
            )}
          >
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}

interface PageShellProps {
  children: ReactNode
  className?: string
  /** Ancho máximo del contenido. */
  size?: 'default' | 'narrow' | 'prose'
}

/** Contenedor `<main>` común con el espaciado de todas las páginas. */
export function PageShell({
  children,
  className,
  size = 'default'
}: PageShellProps): JSX.Element {
  return (
    <main
      className={cn(
        'grow container mx-auto space-y-10 px-4 py-6 md:py-10',
        size === 'narrow' && 'max-w-3xl',
        size === 'prose' && 'max-w-4xl',
        className
      )}
    >
      {children}
    </main>
  )
}

/** Pastilla de estadística para usar como `children` de `PageHeader`. */
export function HeaderStat({
  icon: Icon,
  children
}: {
  icon?: LucideIcon
  children: ReactNode
}): JSX.Element {
  return (
    <span className='inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground'>
      {Icon != null && <Icon aria-hidden='true' className='size-4' />}
      {children}
    </span>
  )
}
