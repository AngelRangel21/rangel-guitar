import { Home, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { Link } from '@/i18n/navigation'

/**
 * Página 404 dentro de un idioma: se muestra con el header y el footer del
 * layout de `[locale]`.
 */
export default function LocaleNotFound(): JSX.Element {
  const t = useTranslations('notFoundPage')

  return (
    <main className='grow container mx-auto flex items-center justify-center px-4 py-16'>
      <div className='relative w-full max-w-2xl overflow-hidden rounded-3xl border bg-linear-to-b from-muted/60 to-background px-6 py-16 text-center sm:py-20'>
        {/* Seis "cuerdas" decorativas */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col gap-4 opacity-50 mask-[linear-gradient(to_right,black,transparent_30%,transparent_70%,black)]'
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <span
              key={n}
              className='block w-full bg-border'
              style={{ height: `${n * 0.5}px` }}
            />
          ))}
        </div>

        <div className='relative space-y-4'>
          <p className='text-8xl font-bold tracking-tighter text-foreground sm:text-9xl font-headline'>
            404
          </p>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('title')}
          </h1>
          <p className='mx-auto max-w-md text-muted-foreground'>
            {t('description')}
          </p>
          <div className='flex flex-wrap justify-center gap-2 pt-4'>
            <Link
              href='/'
              className='inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85'
            >
              <Home aria-hidden='true' className='size-4' />
              {t('home')}
            </Link>
            <Link
              href='/search'
              className='inline-flex h-11 items-center gap-2 rounded-full border bg-background px-6 text-sm font-semibold transition-colors hover:bg-muted'
            >
              <Search aria-hidden='true' className='size-4' />
              {t('search')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
