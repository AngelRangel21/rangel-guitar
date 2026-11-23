import type { LucideIcon } from 'lucide-react'
import type { JSX, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: ReactNode
  description?: ReactNode
  /** Acciones (botones o enlaces) bajo el texto. */
  children?: ReactNode
  className?: string
}

/** Estado vacío común: icono en círculo, título, descripción y acciones. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-3xl border border-dashed px-6 py-16 text-center md:py-20',
        className
      )}
    >
      <span className='flex size-14 items-center justify-center rounded-full bg-muted'>
        <Icon aria-hidden='true' className='size-6 text-muted-foreground' />
      </span>
      <div className='max-w-md space-y-1'>
        <p className='font-semibold text-foreground'>{title}</p>
        {description != null && (
          <p className='text-sm text-muted-foreground'>{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
