import {
  Heart,
  MessageSquarePlus,
  Music,
  SlidersHorizontal
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JSX, ReactNode } from 'react'
import { ChordVisual } from '@/components/learn/learn-visuals'

interface AuthLayoutProps {
  children: ReactNode
}

/**
 * Layout de las páginas de acceso (login y registro): panel de marca a la
 * izquierda en escritorio y el formulario a la derecha.
 */
export function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
  const t = useTranslations('authLayout')

  const benefits = [
    { icon: Heart, text: t('benefits.favorites') },
    { icon: SlidersHorizontal, text: t('benefits.transpose') },
    { icon: MessageSquarePlus, text: t('benefits.request') }
  ]

  return (
    <main className='grow container mx-auto px-4 py-6 md:py-10'>
      <div className='grid items-stretch gap-6 lg:grid-cols-2'>
        <aside className='relative hidden flex-col justify-between overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground lg:flex'>
          <div className='space-y-6'>
            <span className='flex size-11 items-center justify-center rounded-xl bg-primary-foreground text-primary'>
              <Music aria-hidden='true' className='size-6' />
            </span>
            <h2 className='max-w-sm text-4xl font-bold tracking-tight text-balance font-headline'>
              {t('title')}
            </h2>
            <ul className='space-y-3'>
              {benefits.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className='flex items-center gap-3 text-primary-foreground/80'
                >
                  <span className='flex size-8 items-center justify-center rounded-lg bg-primary-foreground/10'>
                    <Icon aria-hidden='true' className='size-4' />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Diagrama decorativo, heredando los colores invertidos del panel */}
          <div
            aria-hidden='true'
            className='pointer-events-none absolute -bottom-6 -right-6 h-64 opacity-20 [&_.fill-foreground]:fill-primary-foreground [&_.fill-foreground\/80]:fill-primary-foreground [&_.fill-primary]:fill-primary-foreground [&_.stroke-border]:stroke-primary-foreground/60 [&_.stroke-muted-foreground\/60]:stroke-primary-foreground'
          >
            <ChordVisual />
          </div>

          <p className='relative text-sm text-primary-foreground/60'>
            {t('footnote')}
          </p>
        </aside>

        <div className='flex items-center justify-center py-4 lg:py-16'>
          {children}
        </div>
      </div>
    </main>
  )
}
