import NextLink from 'next/link'
import type { JSX } from 'react'

/**
 * 404 de último recurso para rutas fuera de cualquier idioma. El layout raíz
 * no define `<html>` ni el provider de next-intl, así que esta página es
 * autónoma. Las rutas con idioma usan `app/[locale]/not-found.tsx`.
 */
export default function RootNotFound(): JSX.Element {
  return (
    <html lang='es'>
      <body className='flex min-h-dvh items-center justify-center bg-background px-4 font-sans text-foreground antialiased'>
        <main className='space-y-4 text-center'>
          <p className='text-8xl font-bold tracking-tighter'>404</p>
          <h1 className='text-2xl font-bold tracking-tight'>
            Página no encontrada
          </h1>
          <NextLink
            href='/'
            className='inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground'
          >
            Volver al inicio
          </NextLink>
        </main>
      </body>
    </html>
  )
}
