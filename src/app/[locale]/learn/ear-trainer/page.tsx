import { Ear } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { JSX } from 'react'
import { EarTrainer } from '@/components/ear-trainer'
import { ToolPage } from '@/components/learn/tool-page'

/**
 * Metadatos para la página del Entrenador de Oído.
 * Crucial para SEO y cómo se muestra la página al compartirla.
 */
export const metadata: Metadata = {
  title: 'Entrenador de Oído',
  description:
    'Mejora tu oído musical identificando notas. Una herramienta divertida y efectiva para guitarristas de todos los niveles.',
  openGraph: {
    title: 'Entrenador de Oído | Rangel Guitar',
    description: 'Mejora tu oído musical con el entrenador de Rangel Guitar.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Entrenador de Oído de Rangel Guitar'
      }
    ]
  }
}

/**
 * Página que aloja la herramienta de Entrenamiento de Oído.
 * @returns {JSX.Element} La página del Entrenador de Oído.
 */
export default async function EarTrainerPage(): Promise<JSX.Element> {
  const t = await getTranslations()

  return (
    <ToolPage
      icon={Ear}
      group='practice'
      title={t('earTrainerPageTitle')}
      description={t('earTrainerDescription')}
    >
      <EarTrainer />
    </ToolPage>
  )
}
