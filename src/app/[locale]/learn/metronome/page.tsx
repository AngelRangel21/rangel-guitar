import { Gauge } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { JSX } from 'react'
import { ToolPage } from '@/components/learn/tool-page'
import { Metronome } from '@/components/metronome'

/**
 * Metadatos para la página del Metrónomo.
 * Crucial para SEO y cómo se muestra la página al compartirla.
 */
export const metadata: Metadata = {
  title: 'Herramienta de Metrónomo',
  description:
    'Usa nuestro metrónomo interactivo para practicar tu tempo y ritmo. Ajusta los BPM y el compás para adaptarlo a tus necesidades de práctica.',
  openGraph: {
    title: 'Metrónomo Interactivo | Rangel Guitar',
    description: 'Practica tu tempo y ritmo con el metrónomo de Rangel Guitar.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Metrónomo de Rangel Guitar'
      }
    ]
  }
}

/**
 * Página que aloja la herramienta de Metrónomo.
 * @returns {JSX.Element} La página del Metrónomo.
 */
export default async function MetronomePage(): Promise<JSX.Element> {
  const t = await getTranslations()

  return (
    <ToolPage
      icon={Gauge}
      group='practice'
      title={t('metronomePageTitle')}
      description={t('metronomeDescription')}
    >
      <Metronome />
    </ToolPage>
  )
}
