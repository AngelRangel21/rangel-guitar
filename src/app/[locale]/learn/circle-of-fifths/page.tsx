import { Orbit } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { JSX } from 'react'
import { CircleOfFifthsWrapper } from '@/components/circle-of-fifths-wrapper'
import { ToolPage } from '@/components/learn/tool-page'

/**
 * Metadatos para la página del Círculo de Quintas Interactivo.
 * Crucial para SEO y cómo se muestra la página al compartirla.
 */
export const metadata: Metadata = {
  title: 'Círculo de Quintas Interactivo',
  description:
    'Explora las relaciones entre tonalidades musicales con nuestro círculo de quintas interactivo. Una herramienta esencial para compositores y estudiantes de música.',
  openGraph: {
    title: 'Círculo de Quintas Interactivo | Rangel Guitar',
    description:
      'Explora las relaciones entre tonalidades con el Círculo de Quintas de Rangel Guitar.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Círculo de Quintas de Rangel Guitar'
      }
    ]
  }
}

/**
 * Página que muestra la herramienta del Círculo de Quintas.
 * El componente principal se carga dinámicamente para mejorar el rendimiento inicial.
 * @returns {JSX.Element} La página del Círculo de Quintas.
 */
export default async function CircleOfFifthsPage(): Promise<JSX.Element> {
  const t = await getTranslations()

  return (
    <ToolPage
      icon={Orbit}
      group='theory'
      title={t('circleOfFifthsPageTitle')}
      description={t('circleOfFifthsDescription')}
    >
      <CircleOfFifthsWrapper />
    </ToolPage>
  )
}
